import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { ChevronDownIcon, SearchIcon } from 'lucide-react';
import Footer from '@/components/Footer';
import { FaFilter } from 'react-icons/fa';
import Navbar from '@/components/Navbar';
import { pyqFilters } from '@/constants/filters';
import { MdVerified } from 'react-icons/md';
import Cookies from 'js-cookie';
import { BASE_URL } from '@/constants/data';
import { ThreeDot } from 'react-loading-indicators';
import { useSearchParams } from 'next/navigation';

const PYQs = () => {
  const searchParams = useSearchParams();
  const query = searchParams.get('query');
  const [filters, setFilters] = useState(pyqFilters);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOption, setSortOption] = useState(query ? query : 'Newest');
  const [filteredNotes, setFilteredNotes] = useState([]);
  const [openDropdowns, setOpenDropdowns] = useState({});
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  useEffect(() => {
    const fetchNotes = async () => {
      const token = Cookies.get('token');
      try {
        const response = await axios.get(`${BASE_URL}api/v1/pyq/`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setNotes(response.data);
        // console.log(response.data);
        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };

    fetchNotes();
  }, []);

  const noteMatchesSearch = (note, term) => {
    const searchTermLower = term.toLowerCase();
    const fieldsToSearch = [
      note.title,
      note.subject,
      note.subjectCode,
      note.unit,
      note.year,
      note.semester,
      note.user?.name,
      note.user?.enrollmentNo,
      note.keyword,
      ...(note.tags?.map((tag) => tag.name) || []),
    ];

    return fieldsToSearch.some((field) =>
      field?.toLowerCase().includes(searchTermLower)
    );
  };

  useEffect(() => {
    let result = [...notes];

    // Apply search first
    if (searchTerm) {
      result = result.filter((note) => noteMatchesSearch(note, searchTerm));
    }

    // Apply filters
    filters.forEach((filter) => {
      const checkedOptions = filter.options
        .filter((option) => option.checked)
        .map((option) => option.value.toLowerCase());

      if (checkedOptions.length > 0) {
        result = result.filter((note) => {
          if (filter.id === 'semester') {
            return checkedOptions.includes(note.semester.toLowerCase());
          }
          if (filter.id === 'subjectcode') {
            return checkedOptions.includes(note.subjectCode.toLowerCase());
          }
          if (filter.id === 'exam') {
            return checkedOptions.includes(note.exam.toLowerCase());
          }
          // Add more specific filter conditions as needed
          return checkedOptions.includes(note[filter.id]?.toLowerCase());
        });
      }
    });

    switch (sortOption) {
      case 'Oldest':
        result.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
        break;
      case 'Newest':
        result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
      case 'Verified':
        result = result.filter((note) => note.user?.accountType === 'faculty');
        // Also sort verified notes by date
        result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
      default:
        result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
    }

    setFilteredNotes(result);
  }, [filters, searchTerm, sortOption, notes]);

  const handleFilterChange = (filterId, optionValue) => {
    setFilters((prevFilters) =>
      prevFilters.map((filter) =>
        filter.id === filterId
          ? {
              ...filter,
              options: filter.options.map((option) =>
                option.value === optionValue
                  ? { ...option, checked: !option.checked }
                  : option
              ),
            }
          : filter
      )
    );
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSortChange = (option) => {
    setSortOption(option);
  };

  const toggleDropdown = (sectionId) => {
    setOpenDropdowns((prev) => ({
      ...prev,
      [sectionId]: !prev[sectionId],
    }));
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${day}/${month}/${year}`;
  };

  const NoteCard = ({ note, formatDate }) => {
    return (
      <div className="group relative bg-gradient-to-b from-white via-white to-tertiary/40 border rounded shadow-md p-4">
        {note.user?.accountType === 'faculty' && (
          <MdVerified
            className="absolute -top-1 -right-1"
            size="20"
            color="#B59410"
          />
        )}
        <h1 className="text-xl text-primary sm:text-2xl pb-2 border-b mb-2 truncate">
          {note.title}
        </h1>
        <div className="flex justify-between items-center mb-2">
          <p className="text-sm">{note.semester} sem</p>
          <div className="flex space-x-1">
            <a
              href={note.fileUrl}
              rel="noopener noreferrer"
              className="bg-secondary text-primary px-2 py-1 rounded text-sm"
            >
              Download
            </a>
          </div>
        </div>
        <div className="text-xs text-gray-500 space-y-1">
          <p>{note.user?.name}</p>
          <div className="flex gap-2">
            <p>Subject: {note.subject}</p>
            <p>Exam: {note.exam}</p>
          </div>
          <p>Subject Code: {note.subjectCode}</p>
          <div className="flex gap-4">
            <p>Unit: {note.unit}</p>
            <p>Year: {note.year}</p>
          </div>
          {note.tags && note.tags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              <span>Tags:</span>
              {note.tags.map((tag) => (
                <span
                  key={tag._id}
                  className="bg-gray-200 text-gray-600 px-2 py-0.5 rounded-full text-xs"
                >
                  {tag.name}
                </span>
              ))}
            </div>
          )}
          <p className="text-gray-400">{formatDate(note.createdAt)}</p>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white w-full min-h-screen">
      <Navbar />

      <main className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:justify-between border-b border-gray-200 pb-3 pt-3 items-center">
          <h1 className="text-2xl font-bold tracking-tight text-primary mb-4 sm:mb-0">
            Explore PYQs
          </h1>

          <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4 w-full sm:w-auto">
            <div className="relative w-full sm:w-auto">
              <input
                type="text"
                placeholder="Search pyq, subjects, tags..."
                className="w-full sm:w-auto pl-10 pr-4 py-2 border rounded-md outline-none border-gray-300"
                value={searchTerm}
                onChange={handleSearch}
              />
              <SearchIcon
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={20}
              />
            </div>

            <div className="relative inline-block text-left w-full sm:w-auto">
              <select
                className="w-full sm:w-auto appearance-none bg-white border border-gray-300 rounded-md pl-3 pr-10 py-2 text-sm focus:outline-none"
                value={sortOption}
                onChange={(e) => handleSortChange(e.target.value)}
              >
                <option value="Newest">Newest</option>
                <option value="Oldest">Oldest</option>
                <option value="Verified">Verified Only</option>
              </select>
              <ChevronDownIcon
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={20}
              />
            </div>
          </div>
        </div>

        <section aria-labelledby="products-heading" className="pb-24 pt-6">
          <div className="lg:hidden mb-4">
            <button
              type="button"
              className="w-full flex justify-center items-center gap-1 bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50"
              onClick={() => setMobileFiltersOpen(true)}
            >
              <FaFilter size={12} />
              Filters
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-x-8 gap-y-10">
            {/* Filters */}
            <form className="hidden lg:block">
              {filters.map((section) => (
                <div key={section.id} className="border-b border-gray-200 py-3">
                  <h3 className="flow-root -my-3">
                    <button
                      type="button"
                      className="flex w-full items-center justify-between bg-white py-3 text-sm text-gray-400 hover:text-gray-500"
                      onClick={() => toggleDropdown(section.id)}
                    >
                      <span className="font-medium text-gray-900">
                        {section.name}
                      </span>
                      <span className="ml-6 flex items-center">
                        <ChevronDownIcon
                          className={`h-5 w-5 transform ${
                            openDropdowns[section.id] ? 'rotate-180' : ''
                          }`}
                          aria-hidden="true"
                        />
                      </span>
                    </button>
                  </h3>
                  {openDropdowns[section.id] && (
                    <div className="pt-6">
                      <div className="space-y-4">
                        {section.options.map((option) => (
                          <div key={option.value} className="flex items-center">
                            <input
                              id={`filter-${section.id}-${option.value}`}
                              name={`${section.id}[]`}
                              value={option.value}
                              type="checkbox"
                              checked={option.checked}
                              onChange={() =>
                                handleFilterChange(section.id, option.value)
                              }
                              className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                            />
                            <label
                              htmlFor={`filter-${section.id}-${option.value}`}
                              className="ml-3 text-sm text-gray-600"
                            >
                              {option.label}
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </form>

            {/* Mobile filter dialog */}
            <MobileFilterDialog
              mobileFiltersOpen={mobileFiltersOpen}
              setMobileFiltersOpen={setMobileFiltersOpen}
              filters={filters}
              handleFilterChange={handleFilterChange}
            />

            {/* Note grid */}
            <div className="lg:col-span-4 min-h-screen">
              {loading ? (
                <div className="flex items-center justify-center h-[40vh]">
                  <ThreeDot
                    variant="pulsate"
                    color="#18181C"
                    size="small"
                    text=""
                    textColor=""
                  />
                </div>
              ) : error ? (
                <div className="text-center text-red-600 py-8">
                  Error: {error}
                </div>
              ) : filteredNotes.length === 0 ? (
                <div className="text-center text-gray-500 py-8">
                  No pyqs found matching your criteria
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {filteredNotes.map((note) => (
                    <NoteCard
                      key={note._id}
                      note={note}
                      formatDate={formatDate}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default PYQs;

const MobileFilterDialog = ({
  mobileFiltersOpen,
  setMobileFiltersOpen,
  filters,
  handleFilterChange,
}) => {
  const [openDropdowns, setOpenDropdowns] = useState({});

  const toggleDropdown = (sectionId) => {
    setOpenDropdowns((prev) => ({
      ...prev,
      [sectionId]: !prev[sectionId],
    }));
  };

  return (
    <div
      className={`fixed inset-0 flex z-40 lg:hidden ${
        mobileFiltersOpen ? '' : 'hidden'
      }`}
    >
      <div className="ml-auto relative max-w-xs w-full h-full bg-white shadow-xl py-4 pb-6 flex flex-col overflow-y-auto">
        <div className="px-4 flex items-center justify-between">
          <h2 className="text-lg font-medium text-gray-900">Filters</h2>
          <button
            type="button"
            className="-mr-2 w-10 h-10 p-2 flex items-center justify-center text-gray-400 hover:text-gray-500"
            onClick={() => setMobileFiltersOpen(false)}
          >
            <span className="sr-only">Close menu</span>
            <svg
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Filters */}
        <form className="mt-4">
          {filters.map((section) => (
            <div
              key={section.id}
              className="border-t border-gray-200 pt-4 pb-4"
            >
              <fieldset>
                <legend className="w-full px-2">
                  <button
                    type="button"
                    className="w-full p-2 flex items-center justify-between text-gray-400 hover:text-gray-500"
                    aria-controls={`filter-section-${section.id}`}
                    aria-expanded={openDropdowns[section.id] || false}
                    onClick={() => toggleDropdown(section.id)}
                  >
                    <span className="text-sm font-medium text-gray-900">
                      {section.name}
                    </span>
                    <span className="ml-6 h-7 flex items-center">
                      <svg
                        className={`${
                          openDropdowns[section.id] ? 'rotate-180' : 'rotate-0'
                        } h-5 w-5 transform`}
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        aria-hidden="true"
                      >
                        <path
                          fillRule="evenodd"
                          d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </span>
                  </button>
                </legend>
                {openDropdowns[section.id] && (
                  <div
                    className="pt-4 pb-2 px-4"
                    id={`filter-section-${section.id}`}
                  >
                    <div className="space-y-6">
                      {section.options.map((option, optionIdx) => (
                        <div key={option.value} className="flex items-center">
                          <input
                            id={`filter-${section.id}-${optionIdx}`}
                            name={`${section.id}[]`}
                            value={option.value}
                            type="checkbox"
                            checked={option.checked}
                            onChange={() =>
                              handleFilterChange(section.id, option.value)
                            }
                            className="h-4 w-4 border-gray-300 rounded text-indigo-600 focus:ring-indigo-500"
                          />
                          <label
                            htmlFor={`filter-${section.id}-${optionIdx}`}
                            className="ml-3 text-sm text-gray-600"
                          >
                            {option.label}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </fieldset>
            </div>
          ))}
        </form>
      </div>
    </div>
  );
};
