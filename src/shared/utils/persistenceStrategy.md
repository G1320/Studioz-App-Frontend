# Persistence Strategy Guide

## ✅ DO PERSIST (Small, User-Specific, Rarely Changes)

### 1. **User Data** ⭐ CRITICAL
- **Why**: Small, user-specific, rarely changes
- **Size**: ~1-5KB
- **TTL**: 7 days
- **Query Key**: `['user', userId]`

### 2. **Cart** ⭐ CRITICAL  
- **Why**: Essential for UX, user-specific, small
- **Size**: ~1-10KB (depends on items)
- **TTL**: 30 days (or until checkout)
- **Query Key**: `['cart', userId]`
- **Already handled**: You have `OfflineCartProvider` ✅

### 3. **Wishlists** ⭐ HIGH VALUE
- **Why**: User-specific, small, important for returning users
- **Size**: ~1-5KB per wishlist
- **TTL**: 90 days
- **Query Key**: `['wishlists', userId]`, `['wishlistItems', wishlistId]`

### 4. **User Preferences/Settings**
- **Why**: Small, improves UX
- **Size**: <1KB
- **TTL**: 365 days
- **Examples**: Language preference, theme, notification settings

### 5. **Location Permission State**
- **Why**: Already handled ✅
- **Size**: <1KB
- **TTL**: 365 days

### 6. **Cookie Consent**
- **Why**: Already handled ✅
- **Size**: <1KB
- **TTL**: 365 days

---

## ❌ DON'T PERSIST (Large, Changes Frequently, Stale Data is Bad)

### 1. **Studios Array** ❌
- **Why**: 
  - Large (100+ studios × 5-20KB = 500KB-2MB)
  - Changes frequently (availability, prices, new studios)
  - Stale data = bad UX (wrong prices, unavailable studios)
- **Better**: Fetch fresh on load, use React Query cache in memory (5 min staleTime)

### 2. **Items Array** ❌
- **Why**: 
  - Large (200+ items × 3-10KB = 600KB-2MB)
  - Changes frequently (availability, prices, stock)
  - Stale data = bad UX
- **Better**: Fetch fresh on load, use React Query cache in memory (5 min staleTime)

### 3. **Reservations List** ❌
- **Why**: 
  - Can be large
  - Changes frequently (status updates, new reservations)
  - Stale data = confusion
- **Better**: Fetch fresh, use short staleTime (1-2 min)

### 4. **Notifications** ❌
- **Why**: 
  - Changes frequently
  - Stale notifications = bad UX
- **Better**: Real-time via Socket.io, no persistence needed

### 5. **Search Results** ❌
- **Why**: 
  - Ephemeral, context-specific
  - Large (can be many results)
- **Better**: Don't persist, always fresh

---

## ⚠️ MAYBE PERSIST (Case-by-Case)

### 1. **Individual Studio/Item Details** ⚠️
- **Why**: Smaller than arrays, less frequent changes
- **Size**: 5-20KB per studio/item
- **TTL**: 15-30 minutes
- **Query Key**: `['studio', studioId]`, `['item', itemId]`
- **Recommendation**: ✅ YES, but with short TTL (15-30 min)
- **Benefit**: Instant display when user returns to same studio/item page

### 2. **Categories/Genres/Cities** ⚠️
- **Why**: Small, rarely changes
- **Size**: <10KB total
- **TTL**: 24 hours
- **Recommendation**: ✅ YES, if they're fetched from API (not static config)

---

## 📊 Size Estimates

Assuming:
- 100 studios × 10KB = 1MB
- 200 items × 5KB = 1MB
- **Total: 2MB+** (risky for localStorage)

**Better approach:**
- User data: 5KB
- Cart: 10KB
- Wishlists: 20KB
- Individual studios/items (cached): 50KB
- **Total: ~85KB** ✅ Safe

---

## 🎯 Recommended Strategy

1. **Selective Persistence**: Only persist user-specific, small data
2. **Short TTL for Large Data**: Use React Query in-memory cache (5-15 min)
3. **Fresh on Load**: Always fetch studios/items on app load
4. **Optimistic UI**: Show cached data instantly, then update with fresh data

