(function () {
  const fs = acode.require('fs');
  const editorManager = acode.require('editorManager');
  let panelWindow = null;

  acode.setPlugin('ai-panel-assistant', {
    init() {
      this.createPanel();
    },

    async createPanel() {
      const htmlPath = '/plugins/ai-panel-assistant/panel.html';

      try {
        const htmlContent = await fs.readFile(htmlPath);
        panelWindow = dialog.create('🤖 AI Assistant Panel', htmlContent, {
          onCancel: () => {
            panelWindow = null;
          },
        });
        panelWindow.show();
      } catch (err) {
        alert('Gagal memuat panel.html: ' + err);
      }
    },

    async run() {
      if (!panelWindow) {
        this.createPanel();
      } else {
        panelWindow.show();
      }

      setTimeout(() => {
        const active = editorManager?.activeFile;
        const content = active?.session?.getValue() || '';
        const path = active?.uri || '';
        const name = active?.filename || 'Untitled';

       
        const iframe = document.querySelector('#ai-panel-frame');
        if (iframe && iframe.contentWindow) {
          iframe.contentWindow.postMessage(
            {
              type: 'fileInfo',
              filename: name,
              filepath: path,
              content: content,
            },
            '*'
          );
        }
      }, 500);
    },

    destroy() {
      panelWindow?.hide?.();
    },
  });
})();
