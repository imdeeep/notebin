import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BASE_URL } from '@/constants/data';
import jsCookie from 'js-cookie';
import { toast } from 'react-toastify';
import { PlusIcon, XIcon } from 'lucide-react';

const UploadPYQ = ({ onUploadSuccess }) => {
  const [formData, setFormData] = useState({
    title: '',
    subject: '',
    semester: '',
    examType: '',
    year: '',
    tags: [],
    file: null,
  });
  const [uploadState, setUploadState] = useState('');
  const [loading, setLoading] = useState(false);
  const [existingTags, setExistingTags] = useState([]);
  const [tagSearchQuery, setTagSearchQuery] = useState('');
  const [showTagDropdown, setShowTagDropdown] = useState(false);

  const examType = ['mst1', 'mst2', 'endsem'];

  const semesters = [
    'First',
    'Second',
    'Third',
    'Fourth',
    'Fifth',
    'Sixth',
    'Seventh',
    'Eighth',
  ];

  // Fetch existing tags on component mount
  useEffect(() => {
    fetchTags();
  }, []);

  const fetchTags = async () => {
    try {
      const response = await axios.get(`${BASE_URL}api/v1/file/get-tags`);
      const formattedTags = response.data
        .map((tag) =>
          typeof tag === 'object' ? tag.name || tag.tag || '' : tag
        )
        .filter(Boolean);
      setExistingTags(formattedTags);
    } catch (error) {
      console.error('Error fetching tags:', error);
      toast.error('Failed to load tags');
    }
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      setFormData({ ...formData, file: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };


  // Handle tag selection
  const handleTagSelect = (tag) => {
    if (formData.tags.includes(tag)) {
      toast.error('This tag is already added!');
      return;
    }
    if (formData.tags.length >= 5) {
      toast.error('Maximum 5 tags allowed');
      return;
    }
    setFormData({ ...formData, tags: [...formData.tags, tag] });
    setTagSearchQuery('');
    setShowTagDropdown(false);
  };

  const handleTagCreate = () => {
    const newTag = tagSearchQuery.trim().toLowerCase();
    if (!newTag) return;

    if (existingTags.includes(newTag)) {
      toast.error('This tag already exists!');
      return;
    }

    if (formData.tags.length >= 5) {
      toast.error('Maximum 5 tags allowed');
      return;
    }

    setFormData({ ...formData, tags: [...formData.tags, newTag] });
    setTagSearchQuery('');
    setShowTagDropdown(false);
  };

  const handleTagRemove = (index) => {
    const updatedTags = [...formData.tags];
    updatedTags.splice(index, 1);
    setFormData({ ...formData, tags: updatedTags });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const {
      title,
      subject,
      semester,
      tags,
      file,
      year,
      examType,
    } = formData;
    if (
      !title ||
      !subject ||
      !semester ||
      !file ||
      !year ||
      !examType
    ) {
      toast.error('Please fill all fields and select a file.');
      return;
    }

    const token = jsCookie.get('token');
    const formDataObj = new FormData();
    formDataObj.append('title', title);
    formDataObj.append('subject', subject);
    formDataObj.append('semester', semester);
    formDataObj.append('exam', examType);
    formDataObj.append('year', year);
    formDataObj.append('tags', JSON.stringify(tags));
    formDataObj.append('file', file);

    setLoading(true);
    setUploadState('Uploading...');

    try {
      const response = await axios.post(
        `${BASE_URL}api/v1/pyq/upload`,
        formDataObj,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status === 200) {
        setUploadState('Uploaded successfully!');
        toast.success('File uploaded successfully!');
        setFormData({
          title: '',
          subject: '',
          semester: '',
          tags: [],
          year: '',
          examType: '',
          file: null,
        });
        if (onUploadSuccess) onUploadSuccess();
      }
    } catch (error) {
      console.error('Error uploading file:', error);
      setUploadState('Upload failed. Please try again.');
      toast.error('Failed to upload file. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Filter tags
  const filteredTags = existingTags
    .filter((tag) => tag && typeof tag === 'string')
    .filter((tag) => tag.toLowerCase().includes(tagSearchQuery.toLowerCase()));

  return (
    <div className="w-full h-full p-6 bg-gray-50">
      <h2 className="text-2xl font-bold text-primary mb-6">Upload PYQs</h2>
      <form onSubmit={handleSubmit} className="flex flex-col items-start gap-5">
        <input
          type="text"
          name="title"
          placeholder="Enter Title of the PYQ"
          value={formData.title}
          onChange={handleChange}
          className="outline-none rounded px-3 py-2 w-full max-w-md border border-primary"
        />
        <input
          type="text"
          name="subject"
          placeholder="Enter Subject"
          value={formData.subject}
          onChange={handleChange}
          className="outline-none rounded px-3 py-2 w-full max-w-md border border-primary"
        />

        <select
          name="semester"
          value={formData.semester}
          onChange={handleChange}
          className="outline-none rounded px-3 py-2 w-full max-w-md border border-primary"
        >
          <option value="">Select Semester</option>
          {semesters.map((sem) => (
            <option key={sem} value={sem}>
              {sem}
            </option>
          ))}
        </select>

        <select
          name="examType"
          value={formData.examType}
          onChange={handleChange}
          className="outline-none rounded px-3 py-2 w-full max-w-md border border-primary"
        >
          <option value="">Select Exam</option>
          {examType.map((exam) => (
            <option key={exam} value={exam}>
              {exam}
            </option>
          ))}
        </select>

        <input
          type="text"
          name="year"
          placeholder="Enter year of the PYQ"
          value={formData.year}
          onChange={handleChange}
          className="outline-none rounded px-3 py-2 w-full max-w-md border border-primary"
        />

        {/* Tags Section */}
        <div className="w-full max-w-md">
          <div className="relative">
            <input
              type="text"
              value={tagSearchQuery}
              onChange={(e) => {
                setTagSearchQuery(e.target.value);
                setShowTagDropdown(true);
              }}
              placeholder="Search or create tags"
              className="outline-none rounded px-3 py-2 w-full border border-primary shadow-purple-700/40 shadow-xl"
              onFocus={() => setShowTagDropdown(true)}
            />
            {showTagDropdown && tagSearchQuery && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg">
                {filteredTags.length > 0 ? (
                  <ul className="max-h-48 overflow-auto">
                    {filteredTags.map((tag) => (
                      <li
                        key={tag}
                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                        onClick={() => handleTagSelect(tag)}
                      >
                        {tag}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="p-4">
                    <p className="text-sm text-gray-600">
                      No matching tags found
                    </p>
                    <button
                      type="button"
                      onClick={handleTagCreate}
                      className="mt-2 text-primary hover:text-primary/90"
                    >
                      Create &#34;{tagSearchQuery}&#34;
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="flex flex-wrap gap-2 mt-2">
            {formData.tags.map((tag, index) => (
              <div
                key={index}
                className="bg-primary text-white text-xs px-2 py-1 rounded-full flex items-center gap-1"
              >
                <span>{tag}</span>
                <button type="button" onClick={() => handleTagRemove(index)}>
                  <XIcon className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="w-full max-w-md">
          <input
            type="file"
            name="file"
            onChange={handleChange}
            className="w-full"
            accept=".pdf,.doc,.docx"
          />
          <p className="text-sm text-gray-600 mt-1">
            Note: The file size must be less than 50MB, and only PDF and Word
            documents are accepted.
          </p>
        </div>

        {uploadState && (
          <div
            className={`mt-3 text-center ${uploadState.includes('failed') ? 'text-red-500' : 'text-green-500'}`}
          >
            {uploadState}
          </div>
        )}

        <button
          type="submit"
          className="bg-primary text-white px-4 py-2 rounded hover:bg-primary/90 transition duration-300 disabled:opacity-50"
          disabled={loading}
        >
          {loading ? 'Uploading...' : 'Upload'}
        </button>
      </form>
    </div>
  );
};

export default UploadPYQ;
