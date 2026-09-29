import { Extension } from '@tiptap/core'

export const Indent = Extension.create({
  name: 'indent',

  addOptions() {
    return {
      types: ['paragraph', 'heading'],
      minLevel: 0,
      maxLevel: 8,
    }
  },

  addGlobalAttributes() {
    return [
      {
        types: this.options.types,

        attributes: {
          indent: {
            default: 0,

            parseHTML: element => {
              const marginLeft = element.style.marginLeft

              if (!marginLeft) {
                return 0
              }

              const pixels = parseInt(marginLeft, 10)

              return Math.round(pixels / 40)
            },

            renderHTML: attributes => {
              if (!attributes.indent) {
                return {}
              }

              return {
                style: `margin-left: ${attributes.indent * 40}px`,
              }
            },
          },
        },
      },
    ]
  },

  addCommands() {
    return {
      increaseIndent:
        () =>
        ({ state, commands }) => {
          const { $from } = state.selection
          const node = $from.parent

          if (!this.options.types.includes(node.type.name)) {
            return false
          }

          const currentIndent = node.attrs.indent ?? 0

          if (currentIndent >= this.options.maxLevel) {
            return false
          }

          return commands.updateAttributes(node.type.name, {
            indent: currentIndent + 1,
          })
        },

      decreaseIndent:
        () =>
        ({ state, commands }) => {
          const { $from } = state.selection
          const node = $from.parent

          if (!this.options.types.includes(node.type.name)) {
            return false
          }

          const currentIndent = node.attrs.indent ?? 0

          if (currentIndent <= this.options.minLevel) {
            return false
          }

          return commands.updateAttributes(node.type.name, {
            indent: currentIndent - 1,
          })
        },
    }
  },

  addKeyboardShortcuts() {
    return {
      Tab: () => {
        if (
          this.editor.isActive('bulletList') ||
          this.editor.isActive('orderedList')
        ) {
          return false
        }

        return this.editor.commands.increaseIndent()
      },

      'Shift-Tab': () => {
        if (
          this.editor.isActive('bulletList') ||
          this.editor.isActive('orderedList')
        ) {
          return false
        }

        return this.editor.commands.decreaseIndent()
      },
    }
  },
})