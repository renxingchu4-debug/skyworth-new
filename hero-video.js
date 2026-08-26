(function () {
  function initHeroVideo() {
    document.querySelectorAll(".hero-video-container-v3").forEach((container) => {
      const video = container.querySelector(".hero-background-video-v3");
      if (!video) return;
      const ready = () => {
        container.classList.add("is-ready");
        container.classList.remove("is-failed");
        video.play().catch(() => {});
      };
      const failed = () => {
        container.classList.add("is-failed");
        container.classList.remove("is-ready");
      };
      video.addEventListener("canplay", ready, { once: true });
      video.addEventListener("loadeddata", ready, { once: true });
      video.addEventListener("error", failed, { once: true });
      if (video.readyState >= 3) ready();
      const playAttempt = video.play();
      if (playAttempt && typeof playAttempt.catch === "function") playAttempt.catch(() => {});
    });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", initHeroVideo); else initHeroVideo();
})();
