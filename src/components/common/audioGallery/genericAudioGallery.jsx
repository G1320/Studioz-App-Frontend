import React, { useState, useEffect } from 'react';
import GenericList from '../lists/genericList';
import ReactAudioPlayer from 'react-audio-player';

const GenericAudioGallery = ({
  isAudioFilesShown = false,
  isCoverShown = true,
  coverAudioFile,
  audioFiles,
  onSetPreviewAudioFile,
}) => {
  const [preview, setPreview] = useState(coverAudioFile);

  const handleAudioFileChange = (audioFile) => {
    setPreview(audioFile);
    if (onSetPreviewAudioFile) onSetPreviewAudioFile(audioFile);
  };

  useEffect(() => {
    setPreview(coverAudioFile);
  }, [coverAudioFile]);

  const renderItem = (audioFile, index) => (
    <div className="  gallery-audio-file" key={index}>
      <audio src={audioFile} controls />
      {/* <small onClick={() => handleAudioFileChange(audioFile)} className="select-audio-button">
        Preview {index}#
      </small> */}
    </div>
  );

  return (
    <div className="file-gallery-container audio-file-gallery-container">
      {isCoverShown && preview && <audio src={preview} className="cover-audioFile " controls />}
      {isAudioFilesShown && audioFiles && audioFiles.length > 0 && (
        <GenericList data={audioFiles} renderItem={renderItem} className="gallery-audio-files-list " />
      )}
    </div>
  );
};

export default GenericAudioGallery;
