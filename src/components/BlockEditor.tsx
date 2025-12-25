import { motion, Reorder } from 'framer-motion';
import { GripVertical, Trash2, Type, Image as ImageIcon, Video } from 'lucide-react';
import { ContentBlock } from '../types';

interface BlockEditorProps {
  blocks: ContentBlock[];
  onChange: (blocks: ContentBlock[]) => void;
}

export function BlockEditor({ blocks, onChange }: BlockEditorProps) {
  const addBlock = (type: 'text' | 'image' | 'video') => {
    const newBlock: ContentBlock = {
      id: Date.now().toString(),
      type,
      content: '',
      order: blocks.length
    };
    onChange([...blocks, newBlock]);
  };

  const updateBlock = (id: string, content: string) => {
    onChange(
      blocks.map((block) =>
        block.id === id ? { ...block, content } : block
      )
    );
  };

  const deleteBlock = (id: string) => {
    onChange(blocks.filter((block) => block.id !== id));
  };

  const reorderBlocks = (newBlocks: ContentBlock[]) => {
    onChange(newBlocks.map((block, index) => ({ ...block, order: index })));
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-white font-semibold">Content Blocks</h3>
        <div className="flex gap-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => addBlock('text')}
            className="flex items-center gap-2 px-3 py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-md text-sm transition-colors"
          >
            <Type className="w-4 h-4" />
            Text
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => addBlock('image')}
            className="flex items-center gap-2 px-3 py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-md text-sm transition-colors"
          >
            <ImageIcon className="w-4 h-4" />
            Image
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => addBlock('video')}
            className="flex items-center gap-2 px-3 py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-md text-sm transition-colors"
          >
            <Video className="w-4 h-4" />
            Video
          </motion.button>
        </div>
      </div>

      <Reorder.Group
        axis="y"
        values={blocks}
        onReorder={reorderBlocks}
        className="space-y-3"
      >
        {blocks.map((block) => (
          <Reorder.Item key={block.id} value={block}>
            <motion.div
              layout
              className="bg-zinc-800 rounded-lg p-4 space-y-3 border border-zinc-700"
            >
              <div className="flex items-center gap-3">
                <GripVertical className="w-5 h-5 text-gray-400 cursor-grab active:cursor-grabbing" />
                <div className="flex items-center gap-2 px-2 py-1 bg-zinc-700 rounded text-xs text-gray-300 font-medium">
                  {block.type === 'text' && <Type className="w-3 h-3" />}
                  {block.type === 'image' && <ImageIcon className="w-3 h-3" />}
                  {block.type === 'video' && <Video className="w-3 h-3" />}
                  {block.type.toUpperCase()}
                </div>
                <div className="flex-1" />
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => deleteBlock(block.id)}
                  className="p-2 hover:bg-red-900/20 text-red-400 rounded-md transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </motion.button>
              </div>

              {block.type === 'text' ? (
                <textarea
                  value={block.content}
                  onChange={(e) => updateBlock(block.id, e.target.value)}
                  placeholder="Enter your text content..."
                  rows={4}
                  className="w-full px-3 py-2 bg-zinc-900 border border-zinc-700 rounded-md text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-600 resize-none"
                />
              ) : (
                <input
                  type="url"
                  value={block.content}
                  onChange={(e) => updateBlock(block.id, e.target.value)}
                  placeholder={`Enter ${block.type} URL...`}
                  className="w-full px-3 py-2 bg-zinc-900 border border-zinc-700 rounded-md text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-600"
                />
              )}

              {block.content && block.type === 'image' && (
                <img
                  src={block.content}
                  alt="Preview"
                  className="w-full h-40 object-cover rounded-md"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
              )}
            </motion.div>
          </Reorder.Item>
        ))}
      </Reorder.Group>

      {blocks.length === 0 && (
        <div className="text-center py-8 text-gray-400 text-sm">
          No content blocks yet. Click the buttons above to add some.
        </div>
      )}
    </div>
  );
}
