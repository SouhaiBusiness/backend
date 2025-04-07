'use client';

import { useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import MarkdownEditor from 'react-markdown-editor-lite';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/cjs/styles/prism';
import 'react-markdown-editor-lite/lib/index.css';
//import { mongooseconnect } from '@/lib/mongoose';

export default function Blog({
  _id,
  title: existingTitle,
  slug: existingSlug,
  blogcategory: existingBlogcategory,
  description: existingDescription,
  tags: existingTags,
  status: existingStatus,
}) {
  const [redirect, setRedirect] = useState(false);
  const router = useRouter();

  const [title, setTitle] = useState(existingTitle || '');
  const [slug, setSlug] = useState(existingSlug || '');
  const [blogcategory, setBlogcategory] = useState(existingBlogcategory || '');
  const [description, setDescription] = useState(existingDescription || '');
  const [tags, setTags] = useState(existingTags || '');
  const [status, setStatus] = useState(existingStatus || '');
  const [copiedCode, setCopiedCode] = useState('');

  async function createProduct(ev) {
    ev.preventDefault();

    const data = { title, slug, description, blogcategory, tags, status };
    if (_id) {
      await axios.put('/api/blogapi', { ...data, _id });
    } else {
      await axios.post('/api/blogapi', data);
    }

    setRedirect(true);
  }

  if (redirect) {
    router.push('/');
    return null;
  }

  // this function for every space in the speling will be -
  const handleSlugChange = (ev) => {
    const inputValue = ev.target.value;

    const newSlug = inputValue.replace(/\s+/g, '-');

    setSlug(newSlug);
  };

  // Function to handle code copying
  const handleCopyCode = (code) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);

    // Reset copied state after 2 seconds
    setTimeout(() => {
      setCopiedCode('');
    }, 2000);
  };

  return (
    <>
      <form onSubmit={createProduct} className='addWebsiteform'>
        {/* blog title */}
        <div className='w-100 flex flex-col flex-left mb-2' data-aos='fade-up'>
          <label htmlFor='title'> Title</label>
          <input
            type='text'
            id='title'
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder='Enter small title'
          />
        </div>

        {/* blog slug */}
        <div className='w-100 flex flex-col flex-left mb-2' data-aos='fade-up'>
          <label htmlFor='slug'> Slug</label>
          <input
            type='text'
            id='slug'
            value={slug}
            onChange={handleSlugChange}
            placeholder='Enter slug url'
            required
          />
        </div>

        {/* blog category */}
        <div className='w-100 flex flex-col flex-left mb-2' data-aos='fade-up'>
          <label htmlFor='category'> Category</label>
          <select
            name='category'
            id='category'
            value={blogcategory}
            onChange={(e) =>
              setBlogcategory(
                Array.from(e.target.selectedOptions, (option) => option.value)
              )
            }
            multiple
          >
            <option value='javascript'> HTML, CSS & JAVASCRIPT</option>
            <option value='nextjs'> NEXT JS & REACT JS </option>
            <option value='database'> DATABASE</option>
            <option value='deployment'> DEPLOYMENT</option>
            <option value='nextjs'> DEVELOPPEMENT WEB </option>
            <option value='communication'> COMMUNICATION</option>
            <option value='traduction'> TRADUCTION</option>
            <option value='littéraure'> LITTERATURE</option>
            <option value='linguistique'> LINGUISTIQUE</option>
            <option value='philosophie'> PHILOSOPHIE</option>
            <option value='sociologie'> SOCIOLOGIE</option>
            <option value='psychologie'> PSYCHOLOGIE</option>
          </select>
          <p className='existingcategory flex gap-1 mt-1 mb-1'>
            selected:{' '}
            {Array.isArray(existingBlogcategory) &&
              existingBlogcategory.map((category, i) => (
                <span key={i}>{category}</span>
              ))}
          </p>
        </div>

        {/* Markdown description content */}
        <div className='description w-100 flex flex-col flex-left mb-2'>
          <label htmlFor='description'> Blog Content</label>
          <MarkdownEditor
            value={description}
            onChange={(ev) => setDescription(ev.text)}
            style={{ width: '100%', height: '400px' }}
            renderHTML={(text) => (
              <ReactMarkdown
                components={{
                  code({ node, inline, className, children, ...props }) {
                    const match = /language-(\w+)/.exec(className || '');
                    const code = String(children).replace(/\n$/, '');

                    if (inline) {
                      return (
                        <code className='inline-code' {...props}>
                          {children}
                        </code>
                      );
                    }

                    return (
                      <div className='code-block-container'>
                        <div className='code-header'>
                          <span className='code-language'>
                            {match ? match[1] : 'text'}
                          </span>
                          <button
                            className='copy-button'
                            onClick={() => handleCopyCode(code)}
                          >
                            {copiedCode === code ? 'Copied!' : 'Copy code'}
                          </button>
                        </div>
                        <SyntaxHighlighter
                          style={vscDarkPlus}
                          language={match ? match[1] : 'text'}
                          PreTag='div'
                          {...props}
                        >
                          {code}
                        </SyntaxHighlighter>
                      </div>
                    );
                  },
                }}
              >
                {text}
              </ReactMarkdown>
            )}
          />
        </div>

        {/* tags */}
        <div className='w-100 flex flex-col flex-left mb-2' data-aos='fade-up'>
          <label htmlFor='tags'> Tags</label>
          <select
            name='tags'
            id='tags'
            value={tags}
            onChange={(e) =>
              setTags(
                Array.from(e.target.selectedOptions, (option) => option.value)
              )
            }
            multiple
          >
            <option value='html'> HTML</option>
            <option value='css'> CSS </option>
            <option value='javascript'> JAVASCRIPT</option>
            <option value='nextjs'> NEXT JS</option>
            <option value='reactjs'> REACT JS</option>
            <option value='database'> DATABASE</option>
            <option value='deployment'> DEPLOYMENT</option>
            <option value='nextjs'> DEVELOPPEMENT WEB </option>
            <option value='communication'> COMMUNICATION</option>
            <option value='traduction'> TRADUCTION</option>
            <option value='littéraure'> LITTERATURE</option>
            <option value='linguistique'> LINGUISTIQUE</option>
            <option value='philosophie'> PHILOSOPHIE</option>
            <option value='sociologie'> SOCIOLOGIE</option>
            <option value='psychologie'> PSYCHOLOGIE</option>
          </select>
          <p className='existingcategory flex gap-1 mt-1 mb-1'>
            selected:{' '}
            {Array.isArray(existingTags) &&
              existingTags.map((tags, i) => <span key={i}>{tags}</span>)}
          </p>
        </div>

        {/* status */}
        <div className='w-100 flex flex-col flex-left mb-2'>
          <label htmlFor='status'> Status</label>
          <select
            name='status'
            id='status'
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value=''>No Selected </option>
            <option value='draft'>Draft </option>
            <option value='publish'>Publish</option>
          </select>
          <p className='existingcategory flex gap-1 mt-1 mb-1'>
            selected: <span>{existingStatus}</span>
          </p>
        </div>

        {/*save button */}
        <div className='w-100 mb-2'>
          <button type='submit' className='w-100 addwebbtn flex-center'>
            Save Blog
          </button>
        </div>
      </form>

      <style jsx>{`
        .code-block-container {
          margin: 1rem 0;
          border-radius: 6px;
          overflow: hidden;
          background: #1e1e1e;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
        }

        .code-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 8px 16px;
          background: #2d2d2d;
          color: #e0e0e0;
          font-family: monospace;
          font-size: 0.9rem;
        }

        .code-language {
          text-transform: uppercase;
          font-size: 0.8rem;
          font-weight: bold;
          color: #9cdcfe;
        }

        .copy-button {
          background: #3a3a3a;
          border: none;
          border-radius: 4px;
          color: #e0e0e0;
          padding: 4px 8px;
          font-size: 0.8rem;
          cursor: pointer;
          transition: background 0.2s;
        }

        .copy-button:hover {
          background: #4a4a4a;
        }

        .inline-code {
          background: rgba(0, 0, 0, 0.05);
          padding: 2px 4px;
          border-radius: 3px;
          font-family: monospace;
          font-size: 0.9em;
        }

        /* Dark mode support */
        @media (prefers-color-scheme: dark) {
          .inline-code {
            background: rgba(255, 255, 255, 0.1);
            color: #fff;
          }
        }
      `}</style>
    </>
  );
}
