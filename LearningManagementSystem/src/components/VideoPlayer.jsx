function VideoPlayer({ url, title }) {
  return (
    <div className="ratio ratio-16x9 mb-3">
      <video
        controls
        src={url}
        title={title}
        style={{ width: '100%', borderRadius: '8px', background: '#000' }}
      >
        Your browser does not support the video tag.
      </video>
    </div>
  );
}

export default VideoPlayer;
