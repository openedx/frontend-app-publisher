import tinymce from 'tinymce/tinymce.min';
import { BROWSER_DEFAULT, languages } from '../../data/constants/formOptions';
import updateFormLanguage from '../../data/actions/formOptions';
import { getLanguageforEditor } from '../../data/reducers/formOptions';
import store from '../../data/store';

tinymce.PluginManager.add('language', (editor) => {
  const replaceText = (newText) => {
    const selectedNode = editor.selection.getNode();
    if (selectedNode.nodeName === 'SPAN') {
      if (!selectedNode.innerText.trim()) {
        editor.dom.setOuterHTML(selectedNode, newText);
      } else {
        editor.dom.setOuterHTML(selectedNode, `${selectedNode.outerHTML}${newText}`);
      }
    } else if (!selectedNode.innerText.trim() && selectedNode.innerText !== ' ') {
      selectedNode.innerHTML = newText;
    } else if (selectedNode.nodeName === 'P') {
      selectedNode.innerHTML += newText;
    } else if (selectedNode.nodeName === 'BR') {
      editor.dom.setOuterHTML(selectedNode, newText);
    } else {
      editor.dom.setOuterHTML(selectedNode, `${selectedNode.outerHTML}${newText}`);
    }
    const newSpan = editor.dom.get('new_span');
    editor.selection.select(newSpan);
    editor.selection.collapse(false);
    newSpan.removeAttribute('id');
  };
  const resetLanguage = () => {
    replaceText('<span id="new_span">&#65279</span>');
  };

  const openDialog = (buttonApi) => {
    const selectedNode = editor.selection.getNode();
    const state = store.getState();
    return editor.windowManager.open({
      title: 'Language plugin',
      body: {
        type: 'panel',
        items: [
          {
            type: 'htmlpanel', // component type
            html: `<div>Current language: ${languages[getLanguageforEditor(state, editor.id)].nativeName}</div>`,
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
        if (!editor.selection.isCollapsed()) {
          editor.notificationManager.open({
            text: 'You cannot set the language of a selection. Change the language first and then continue typing.',
            type: 'error',
          });
          api.close();
          return;
        }
        if (data.language !== BROWSER_DEFAULT) {
          const dummySpan = `<span lang=${data.language} id="new_span">&#65279</span>`;
          replaceText(dummySpan);
        } else if (selectedNode.lang) {
          resetLanguage(selectedNode);
        }
        store.dispatch(updateFormLanguage(data.language, editor.id));
        buttonApi.setActive(data.language !== BROWSER_DEFAULT);
        api.close();
      },
    });
  };

  editor.ui.registry.addToggleButton('language', {
    text: 'Foreign language',
    onAction(buttonApi) {
      openDialog(buttonApi);
    },
    onSetup(buttonApi) {
      editor.addShortcut('Meta+L', 'Switch to default language', () => {
        const state = store.getState();
        if (getLanguageforEditor(state, editor.id) !== BROWSER_DEFAULT) {
          resetLanguage();
          buttonApi.setActive(false);
          store.dispatch(updateFormLanguage(BROWSER_DEFAULT, editor.id));
        }
      });
      const updateCurrentLanguage = () => {
        const selectedNode = editor.selection.getNode();
        if (selectedNode.lang) {
          store.dispatch(updateFormLanguage(selectedNode.lang, editor.id));
          buttonApi.setActive(true);
        } else {
          store.dispatch(updateFormLanguage(BROWSER_DEFAULT, editor.id));
          buttonApi.setActive(false);
        }
      };
      editor.on('keyup', () => {
        updateCurrentLanguage();
      });
      editor.on('click', () => {
        updateCurrentLanguage();
      });
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
