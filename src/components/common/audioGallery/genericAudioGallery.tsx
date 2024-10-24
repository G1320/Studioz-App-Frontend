import { useState, useEffect } from 'react';
import { GenericList } from '@/components/common/lists/GenericList';

interface GenericAudioGalleryProps {
  isAudioFilesShown?: boolean;
  isCoverShown?: boolean;
  coverAudioFile?: string;
  audioFiles?: string[];
  className?: string;
  onSetPreviewAudioFile?: (audioFile: string) => void;
}

export const GenericAudioGallery: React.FC<GenericAudioGalleryProps> = ({
  isAudioFilesShown = false,
  isCoverShown = true,
  coverAudioFile,
  audioFiles
  // onSetPreviewAudioFile,
}) => {
  const [preview, setPreview] = useState<string | undefined>(coverAudioFile);

  useEffect(() => {
    setPreview(coverAudioFile);
  }, [coverAudioFile]);

  const renderItem = (audioFile: string, index: number) => (
    <div className="gallery-audio-file" key={index}>
      <audio src={audioFile} controls />
    </div>
  );

  return (
    <div className="file-gallery-container audio-file-gallery-container">
      {isCoverShown && preview && <audio src={preview} className="cover-audioFile" controls />}
      {isAudioFilesShown && audioFiles && audioFiles.length > 0 && (
        <GenericList data={audioFiles} renderItem={renderItem} className="gallery-audio-files-list" />
      )}
    </div>
  );
};
