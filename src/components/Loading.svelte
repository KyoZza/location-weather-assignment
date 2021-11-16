<div class="overlay">
  <div class="loading" />
</div>

<style>
  .overlay {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 1000;
    width: 100vw;
    height: 100%;
    max-height: 100vh;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background-color: rgba(0, 0, 0, 0.7);
  }

  .loading {
    box-sizing: border-box;
    width: 72px;
    height: 72px;
    border-radius: 100%;
    border: 8px solid var(--border-color);
    border-top-color: var(--font-color);
    animation: spin 1s infinite linear;
  }

  @keyframes spin {
    100% {
      transform: rotate(360deg);
    }
  }
</style>
