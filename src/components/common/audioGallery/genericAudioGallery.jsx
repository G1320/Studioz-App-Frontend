import React, { useState, useEffect } from 'react';
import GenericList from '../lists/genericList';

const GenericAudioGallery = ({
  isAudioFilesShown = false,
  isCoverShown = true,
  coverAudioFile,
  audioFiles,
  onSetPreviewAudioFile,
}) => {
  const [currCoverAudioFile, setCurrCoverAudioFile] = useState(coverAudioFile);

  const handleAudioFileChange = (audioFile) => {
    setCurrCoverAudioFile(audioFile);
    if (onSetPreviewAudioFile) onSetPreviewAudioFile(audioFile);
  };

  useEffect(() => {
    setCurrCoverAudioFile(coverAudioFile);
  }, [coverAudioFile]);

  const renderItem = (audioFile, index) => (
    <div className=" preview gallery-audio-file" key={index}>
      {/* <audio className="preview gallery-audio-file" src={audioFile} controls /> */}
      <p onClick={() => handleAudioFileChange(audioFile)} className="select-audio-button">
        {index}# Preview
      </p>
    </div>
  );

  return (
    <div className="audioFile-gallery-container">
      {isCoverShown && currCoverAudioFile && (
        <audio src={currCoverAudioFile} className="cover-audioFile " controls />
      )}
      {isAudioFilesShown && audioFiles && audioFiles.length > 0 && (
        <GenericList data={audioFiles} renderItem={renderItem} className="gallery-audio-files-list " />
      )}
    </div>
  );
};

export default GenericAudioGallery;
