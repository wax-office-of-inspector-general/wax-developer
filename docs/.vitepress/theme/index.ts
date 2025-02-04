// https://vitepress.dev/guide/custom-theme
import { h, nextTick } from 'vue'
import DefaultTheme from 'vitepress/theme'
import './style.css'

/** @type {import('vitepress').Theme} */
export default {
  extends: DefaultTheme,
  Layout: () => {
    return h(DefaultTheme.Layout, null, {
      // https://vitepress.dev/guide/extending-default-theme#layout-slots
    })
  },
  enhanceApp({ app, router, siteData }) {
    nextTick(() => {
      // Ensure the script is loaded only once
      if (document.querySelector('script[src="https://dashboard.letmeexplain.ai/embed/lme_chatbot_widget.js"]')) {
        console.log("Chatbot script already loaded");
        return; // Exit if already loaded
      }

      // Create the script element
      const script = document.createElement('script');
      script.src = 'https://dashboard.letmeexplain.ai/embed/lme_chatbot_widget.js';
      script.async = true;
      script.onload = () => {
        // Initialize the chatbot widget once the script is loaded
        let attempts = 0;

        // Function to load the chatbot widget
        function loadChatbot() {
          if (window.loadCustomWidget) {
            window.loadCustomWidget({
              orgId: 'e5e1b584-a725-41'  // Correct orgId here
            });
          } else if (attempts < 10) {
            attempts++;
            console.warn('Chatbot not ready. Retrying in 500ms...');
            setTimeout(loadChatbot, 500);
          } else {
            console.error('Failed to load chatbot after multiple attempts.');
          }
        }

        loadChatbot();
      };

      // Append the script to the document body
      document.body.appendChild(script);
    });
  }
}