import { Extension } from '@tiptap/core';
import Suggestion from '@tiptap/suggestion';
import tippy from 'tippy.js';
import { ReactRenderer } from '@tiptap/react';
import UserMention from '../../components/UserMention';

export const MentionExtension = Extension.create({
  name: 'mention',

  addOptions() {
    return {
      suggestion: {
        char: '@',
        command: ({ editor, range, props }) => {
          // Optimize insert by doing it in a single transaction
          editor.view.dispatch(
            editor.state.tr
              .deleteRange(range.from, range.to)
              .insertText(`@${props.label} `)
          );
        },
        render: () => {
          let component;
          let popup;

          return {
            onStart: (props) => {
              if (!props.clientRect) {
                return;
              }

              component = new ReactRenderer(UserMention, {
                props,
                editor: props.editor,
              });

              popup = tippy('body', {
                getReferenceClientRect: props.clientRect,
                appendTo: document.body,
                content: component.element,
                showOnCreate: true,
                interactive: true,
                trigger: 'manual',
                placement: 'bottom-start',
                // Performance optimizations for tippy
                animation: false,
                inertia: false,
                popperOptions: {
                  modifiers: [
                    {
                      name: 'flip',
                      enabled: false,
                    },
                    {
                      name: 'preventOverflow',
                      options: {
                        rootBoundary: 'viewport',
                      },
                    },
                  ],
                },
              });
            },
            onUpdate(props) {
              if (!props.clientRect) {
                return;
              }

              component?.updateProps(props);
              popup?.[0].setProps({
                getReferenceClientRect: props.clientRect,
              });
            },
            onKeyDown(props) {
              if (props.event.key === 'Escape') {
                popup?.[0].hide();
                return true;
              }
              return component?.ref?.onKeyDown(props);
            },
            onExit() {
              popup?.[0].destroy();
              component?.destroy();
            },
          };
        },
      },
    };
  },

  addProseMirrorPlugins() {
    return [
      Suggestion({
        editor: this.editor,
        ...this.options.suggestion,
        // Performance optimization: only re-render on actual content changes
        key: 'mention',
        skipDuplicates: true,
      }),
    ];
  },
});
