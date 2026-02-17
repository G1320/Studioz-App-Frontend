#!/usr/bin/env python3
"""
Batch-update all V5 ad files to use useScale() for responsive layouts.

This script:
1. Adds 'useScale' to the import from './shared'
2. Adds 'const s = useScale();' in each scene component function
3. Replaces hardcoded pixel values in style objects with s(value)
"""
import re
import os
import glob

ADS_DIR = os.path.join(os.path.dirname(__file__), "src", "ads-v5")

def process_file(filepath):
    with open(filepath, 'r') as f:
        content = f.read()

    original = content

    # Step 1: Add useScale to the shared import
    # Find the import from './shared' and add useScale if not present
    if 'useScale' not in content:
        # Match the import block from './shared'
        content = re.sub(
            r"(import\s*\{[^}]*)(}\s*from\s*['\"]\.\/shared['\"])",
            lambda m: m.group(1) + ('  useScale,\n' if m.group(1).rstrip().endswith(',') or m.group(1).rstrip().endswith('{') else ',\n  useScale,\n') + m.group(2),
            content,
            count=1
        )
        # Cleaner approach: just add useScale before the closing brace
        if 'useScale' not in content:
            content = re.sub(
                r'(from\s*["\']\.\/shared["\'])',
                r'\1',
                content
            )

    # Alternative simpler approach for the import
    if 'useScale' not in content:
        # Find last import item before } from './shared'
        content = re.sub(
            r"(\w+),?\s*\n(\}\s*from\s*['\"]\.\/shared['\"])",
            r"\1,\n  useScale,\n\2",
            content,
            count=1
        )

    # Step 2: Add 'const s = useScale();' to each scene component
    # Pattern: find 'const SceneXxx: React.FC = () => {' or similar function bodies
    # that use useCurrentFrame or useVideoConfig
    # We look for component functions and add s = useScale() after the first variable declarations

    # Find all component function bodies and add useScale
    # Pattern: after 'const { fps } = useVideoConfig();' or 'const frame = useCurrentFrame();'
    # Add 'const s = useScale();' if not already present

    # For components that have useVideoConfig:
    lines = content.split('\n')
    new_lines = []
    in_component = False
    added_scale = False
    brace_depth = 0

    for i, line in enumerate(lines):
        new_lines.append(line)

        stripped = line.strip()

        # Track if we're entering a scene component
        if re.match(r'const\s+Scene\w+:\s*React\.FC', stripped) or \
           re.match(r'const\s+Scene\w+\s*=\s*\(\)\s*=>\s*\{', stripped):
            in_component = True
            added_scale = False
            brace_depth = 0

        # Count braces to track scope
        if in_component:
            brace_depth += stripped.count('{') - stripped.count('}')
            if brace_depth <= 0 and stripped.endswith('};'):
                in_component = False

        # Add useScale after the frame/fps declarations
        if in_component and not added_scale:
            if ('useVideoConfig()' in stripped or 'useCurrentFrame()' in stripped) and \
               'const s = useScale()' not in content[content.find(stripped):content.find(stripped)+500]:
                # Check if the next few lines already have useScale
                upcoming = '\n'.join(lines[i+1:i+5])
                if 'useScale()' not in upcoming and 'const s = useScale' not in upcoming:
                    indent = len(line) - len(line.lstrip())
                    new_lines.append(' ' * indent + 'const s = useScale();')
                    added_scale = True

    content = '\n'.join(new_lines)

    # Step 3: Replace pixel values in style objects
    # Target specific CSS properties that should be scaled

    # Pattern: fontSize: NUMBER (where NUMBER > 10)
    content = re.sub(
        r'fontSize:\s*(\d+)(?!\s*\*)',
        lambda m: f'fontSize: s({m.group(1)})' if int(m.group(1)) > 10 else m.group(0),
        content
    )

    # Pattern: gap: NUMBER (where NUMBER > 4)
    content = re.sub(
        r'gap:\s*(\d+)(?!\s*\*)',
        lambda m: f'gap: s({m.group(1)})' if int(m.group(1)) > 4 else m.group(0),
        content
    )

    # Pattern: marginTop: NUMBER (where NUMBER > 4)
    content = re.sub(
        r'marginTop:\s*(\d+)(?!\s*\*)',
        lambda m: f'marginTop: s({m.group(1)})' if int(m.group(1)) > 4 else m.group(0),
        content
    )

    # Pattern: marginBottom: NUMBER (where NUMBER > 4)
    content = re.sub(
        r'marginBottom:\s*(\d+)(?!\s*\*)',
        lambda m: f'marginBottom: s({m.group(1)})' if int(m.group(1)) > 4 else m.group(0),
        content
    )

    # Pattern: borderRadius: NUMBER (where NUMBER > 4)
    content = re.sub(
        r'borderRadius:\s*(\d+)(?!\s*[,\*%])',
        lambda m: f'borderRadius: s({m.group(1)})' if int(m.group(1)) > 4 else m.group(0),
        content
    )

    # Pattern: padding strings like "120px 50px 60px" or "80px 48px"
    # Replace with template literals using s()
    def replace_padding(m):
        prop = m.group(1)  # 'padding' or 'margin'
        values = m.group(2)
        # Parse the px values
        parts = re.findall(r'(\d+)px', values)
        if len(parts) == 2:
            return f'{prop}: `${{s({parts[0]})}}px ${{s({parts[1]})}}px`'
        elif len(parts) == 3:
            return f'{prop}: `${{s({parts[0]})}}px ${{s({parts[1]})}}px ${{s({parts[2]})}}px`'
        elif len(parts) == 4:
            return f'{prop}: `${{s({parts[0]})}}px ${{s({parts[1]})}}px ${{s({parts[2]})}}px ${{s({parts[3]})}}px`'
        return m.group(0)

    content = re.sub(
        r'(padding|margin):\s*"([\d\s]+px[\dpx\s]*)"',
        replace_padding,
        content
    )

    # Pattern: margin strings like "0 0 10px" or "Npx 0 0"
    def replace_margin_complex(m):
        prop = m.group(1)
        val = m.group(2)
        # Handle mixed zero and px values
        parts = val.split()
        result_parts = []
        for p in parts:
            px_match = re.match(r'(\d+)px', p)
            if px_match and int(px_match.group(1)) > 0:
                result_parts.append(f'${{s({px_match.group(1)})}}px')
            else:
                result_parts.append(p)
        if any('${' in rp for rp in result_parts):
            return f'{prop}: `{" ".join(result_parts)}`'
        return m.group(0)

    content = re.sub(
        r'(margin):\s*"([^"]*\d+px[^"]*)"',
        replace_margin_complex,
        content
    )

    # Pattern: width: NUMBER and height: NUMBER for icon/box sizes (10 < N < 500)
    # Be careful not to match width/height in video config contexts
    # Only match within style objects (after style={{ or in style props)
    # We'll be conservative and match specific patterns
    def replace_dimension(m):
        prop = m.group(1)
        val = int(m.group(2))
        # Skip values that are likely not pixel values in style context
        if 10 < val < 500:
            return f'{prop}: s({val})'
        return m.group(0)

    # Replace width/height in style contexts - use a simpler pattern
    # Match lines that have width: N or height: N as style props
    def replace_dim_line(m):
        prop = m.group(1)
        val = int(m.group(2))
        if 10 < val < 500:
            return f'{prop}: s({val})'
        return m.group(0)

    content = re.sub(
        r'\b(width|height):\s*(\d+)(?=\s*[,\}])',
        replace_dim_line,
        content
    )

    # Step 4: Handle absolute position values in style objects
    # top: NUMBER, bottom: NUMBER, left: NUMBER, right: NUMBER (where > 10)
    for prop in ['top', 'bottom', 'left', 'right']:
        content = re.sub(
            rf'(?<![a-zA-Z]){prop}:\s*(\d+)(?=\s*[,\}}])',
            lambda m, p=prop: f'{p}: s({m.group(1)})' if int(m.group(1)) > 10 else m.group(0),
            content
        )

    # Step 5: Handle animation translateY values in interpolate calls
    # Pattern: interpolate(something, [0, 1], [-30, 0])
    # We want to scale the pixel output values
    content = re.sub(
        r'(interpolate\([^,]+,\s*\[0,\s*1\],\s*\[)(-?\d+)(,\s*0\]\))',
        lambda m: f'{m.group(1)}s({m.group(2)}){m.group(3)}' if abs(int(m.group(2))) > 10 else m.group(0),
        content
    )

    # Also handle [VALUE, 0] pattern more broadly for transforms
    content = re.sub(
        r'(interpolate\([^,]+,\s*\[0,\s*1\],\s*\[)([-]?\d+)(,\s*)([-]?\d+)(\]\))',
        lambda m: (
            f'{m.group(1)}s({m.group(2)}){m.group(3)}s({m.group(4)}){m.group(5)}'
            if abs(int(m.group(2))) > 10 or abs(int(m.group(4))) > 10
            else m.group(0)
        ),
        content
    )

    # Step 6: Handle RadialGlow size prop
    content = re.sub(
        r'<RadialGlow([^>]*?)size=\{(\d+)\}',
        lambda m: f'<RadialGlow{m.group(1)}size={{s({m.group(2)})}}',
        content
    )

    # Fix any double-wrapped s(s(N)) that might have been created
    content = re.sub(r's\(s\((\d+)\)\)', r's(\1)', content)

    # Fix any s() in non-component contexts (like const declarations outside components)
    # This shouldn't happen with our targeted approach, but just in case

    if content != original:
        with open(filepath, 'w') as f:
            f.write(content)
        return True
    return False


def main():
    ad_files = sorted(glob.glob(os.path.join(ADS_DIR, "Ad*_V5.tsx")))
    print(f"Found {len(ad_files)} V5 ad files")

    updated = 0
    for filepath in ad_files:
        filename = os.path.basename(filepath)
        if process_file(filepath):
            print(f"  [UPDATED] {filename}")
            updated += 1
        else:
            print(f"  [NO CHANGE] {filename}")

    print(f"\nUpdated {updated}/{len(ad_files)} files")


if __name__ == "__main__":
    main()
