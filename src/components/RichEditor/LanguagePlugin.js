import tinymce from 'tinymce/tinymce.min';
import { BROWSER_DEFAULT, languages } from './editorConstants';

tinymce.PluginManager.add('language', (editor) => {
  const replaceText = (lang) => {
    // Depending on the current location of the cursor, replace the current node with
    // the HTML in `lang`
    const newSpanText = lang === BROWSER_DEFAULT ? '<span id="new_span">&#65279</span>' : `<span lang=${lang} id="new_span">&#65279</span>`;
    const selectedNode = editor.selection.getNode();
    if (selectedNode.nodeName === 'SPAN') {
      if (!selectedNode.innerText.trim()) {
        // inner text consists of only whitespace, so replace entire span to reduce nesting
        editor.dom.setOuterHTML(selectedNode, newSpanText);
      } else {
        // inner text does not consist of only whitespace, so append new span to existing HTML
        editor.dom.setOuterHTML(selectedNode, `${selectedNode.outerHTML}${newSpanText}`);
      }
    } else if (selectedNode.nodeName === 'P') {
      // selection is part of a bigger paragraph, so append the new span to existing HTML
      selectedNode.innerHTML += newSpanText;
    } else if (selectedNode.nodeName === 'BR') {
      // text consists of only whitespace, so replace all of it to avoid adding extra whitespace
      editor.dom.setOuterHTML(selectedNode, newSpanText);
    } else {
      // conservatively assume that the selection contains more HTML to the left
      editor.dom.setOuterHTML(selectedNode, `${selectedNode.outerHTML}${newSpanText}`);
    }
    const newSpan = editor.dom.get('new_span');
    editor.selection.select(newSpan);
    editor.selection.collapse(false); // moves cursor to end of selection
    newSpan.removeAttribute('id');
  };

  const openDialog = (buttonApi) => {
    if (!editor.selection.isCollapsed()) {
      editor.notificationManager.open({
        text: 'You cannot set the language of a selection. Change the language first and then continue typing.',
        type: 'error',
      });
    } else {
      const selectedNode = editor.selection.getNode();
      const currentLang = selectedNode.lang ? selectedNode.lang : BROWSER_DEFAULT;
      editor.windowManager.open({
        title: 'Language plugin',
        body: {
          type: 'panel',
          items: [
            {
              type: 'htmlpanel',
              html: `<div>Current language: ${languages[currentLang].nativeName}</div>`,
            },
            {
              type: 'selectbox',
              name: 'language',
              label: 'Language',
              items: Object.keys(languages).map(lang => ({
                value: lang,
                text: languages[lang].nativeName,
              })),
            },
          ],
        },
        buttons: [
          {
            type: 'cancel',
            text: 'Close',
          },
          {
            type: 'submit',
            text: 'Save',
            primary: true,
          },
        ],
        onSubmit(api) {
          const data = api.getData();
          editor.focus();
          editor.undoManager.transact(() => {
            replaceText(data.language);
            buttonApi.setActive(data.language !== BROWSER_DEFAULT);
          });
          api.close();
        },
      });
    }
  };

  editor.ui.registry.addToggleButton('language', {
    text: 'Foreign language',
    onAction(buttonApi) {
      openDialog(buttonApi);
    },
    onSetup(buttonApi) {
      editor.addShortcut('Meta+L', 'Switch to default language', () => {
        const selectedNode = editor.selection.getNode();
        const currentLang = selectedNode.lang ? selectedNode.lang : BROWSER_DEFAULT;
        if (currentLang !== BROWSER_DEFAULT) {
          editor.undoManager.transact(() => {
            replaceText(BROWSER_DEFAULT);
            buttonApi.setActive(false);
          });
        }
      });
      const updateCurrentLanguage = () => {
        if (editor.selection.getNode().lang) buttonApi.setActive(true);
        else buttonApi.setActive(false);
      };
      editor.on('keyup', updateCurrentLanguage);
      editor.on('click', updateCurrentLanguage);
      return () => {
        // remove event listeners on teardown
        editor.off('keyup', updateCurrentLanguage);
        editor.off('click', updateCurrentLanguage);
      };
    },
  });

  return {
    getMetadata() {
      return {
        name: 'Language plugin',
      };
    },
  };
});
