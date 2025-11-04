import { generateHTML } from '@tiptap/html'
import StarterKit from '@tiptap/starter-kit'
import Image from '@tiptap/extension-image'
import Link from '@tiptap/extension-link'
import TextAlign from '@tiptap/extension-text-align'

/**
 * Composable for rendering TipTap JSON content to HTML
 */
export const useTipTapRenderer = () => {
  // Extensions used in the editor
  const extensions = [
    StarterKit,
    Image.configure({
      inline: false,
      allowBase64: true,
    }),
    Link.configure({
      openOnClick: false,
    }),
    TextAlign.configure({
      types: ['heading', 'paragraph'],
    }),
  ]

  /**
   * Convert TipTap JSON content to HTML
   * @param {string|object} content - TipTap JSON content
   * @returns {string} HTML string
   */
  const renderContent = (content) => {
    try {
      let parsedContent = content

      // Parse JSON string if needed
      if (typeof content === 'string') {
        parsedContent = JSON.parse(content)
      }

      // Generate HTML using TipTap's official method
      return generateHTML(parsedContent, extensions)
    } catch (error) {
      console.error('Error rendering TipTap content:', error)
      return '<p>Error rendering content</p>'
    }
  }

  /**
   * Extract plain text from TipTap content for previews
   * @param {string|object} content - TipTap JSON content
   * @param {number} maxLength - Maximum length of text
   * @returns {string} Plain text
   */
  const extractText = (content, maxLength = 150) => {
    try {
      const html = renderContent(content)
      // Strip HTML tags to get plain text
      const text = html.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim()

      if (text.length > maxLength) {
        return text.substring(0, maxLength) + '...'
      }

      return text || 'No content'
    } catch (error) {
      console.error('Error extracting text from TipTap content:', error)
      return 'Error reading content'
    }
  }

  return {
    renderContent,
    extractText
  }
}