import { useState, useEffect } from 'react';
import { Search, Filter, Download, X, MapPin, Clock, Star } from 'lucide-react';
import { interactionsApi } from '../services/api';
import toast from 'react-hot-toast';

const InteractionHistory = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMood, setSelectedMood] = useState('all');
  const [selectedInteraction, setSelectedInteraction] = useState(null);
  const [starredOnly, setStarredOnly] = useState(false);
  
  const [interactions, setInteractions] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchInteractions = async () => {
    try {
      setLoading(true);
      const params = {
        search: searchQuery,
        mood: selectedMood !== 'all' ? selectedMood : undefined,
        starred: starredOnly ? true : undefined
      };
      const response = await interactionsApi.getAll(params);
      setInteractions(response.data);
    } catch (error) {
      console.error("Error fetching interactions:", error);
      toast.error("Failed to load interactions");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Debounce search
    const timer = setTimeout(() => {
      fetchInteractions();
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery, selectedMood, starredOnly]);

  const handleToggleStar = async (e, id) => {
    e.stopPropagation();
    try {
      await interactionsApi.toggleStar(id);
      // Optimistic update or refetch
      setInteractions(interactions.map(i => 
        i.id === id ? { ...i, starred: !i.starred } : i
      ));
      if (selectedInteraction && selectedInteraction.id === id) {
        setSelectedInteraction({ ...selectedInteraction, starred: !selectedInteraction.starred });
      }
    } catch (error) {
      console.error("Error toggling star:", error);
      toast.error("Failed to update interaction");
    }
  };

  const getMoodColor = (mood) => {
    const colors = {
      happy: 'bg-emerald-100 text-emerald-700 border-emerald-200',
      neutral: 'bg-blue-100 text-blue-700 border-blue-200',
      sad: 'bg-gray-100 text-gray-700 border-gray-200',
      anxious: 'bg-yellow-100 text-yellow-700 border-yellow-200',
      confused: 'bg-red-100 text-red-700 border-red-200',
    };
    return colors[mood] || colors.neutral;
  };

  const getMoodEmoji = (mood) => {
    const emojis = {
      happy: '😊',
      neutral: '😐',
      sad: '😢',
      anxious: '😰',
      confused: '😕',
    };
    return emojis[mood] || emojis.neutral;
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now - date;
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffHours < 24) {
      return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
    } else if (diffDays === 1) {
      return 'Yesterday';
    } else if (diffDays < 7) {
      return `${diffDays} days ago`;
    } else {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    }
  };

  const handleExport = () => {
    alert('Export functionality would download interaction history as PDF/CSV');
  };

  return (
    <div className="p-6 lg:p-8 max-w-[1600px] mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
          Interaction History
        </h1>
        <p className="text-lg text-gray-600">
          Review and analyze past conversations
        </p>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name, topic, or keyword..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl
                focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent
                transition-all duration-200"
            />
          </div>

          {/* Mood Filter */}
          <select
            value={selectedMood}
            onChange={(e) => setSelectedMood(e.target.value)}
            className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl
              focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent
              transition-all duration-200 cursor-pointer"
          >
            <option value="all">All Moods</option>
            <option value="happy">Happy</option>
            <option value="neutral">Neutral</option>
            <option value="sad">Sad</option>
            <option value="anxious">Anxious</option>
            <option value="confused">Confused</option>
          </select>

          {/* Starred Filter */}
          <button
            onClick={() => setStarredOnly(!starredOnly)}
            className={`px-6 py-3 rounded-xl font-medium transition-all duration-200 flex items-center gap-2
              ${starredOnly
                ? 'bg-yellow-100 text-yellow-700 border-2 border-yellow-300'
                : 'bg-gray-50 text-gray-600 border border-gray-200 hover:bg-gray-100'
              }`}
          >
            <Star className={`h-5 w-5 ${starredOnly ? 'fill-yellow-700' : ''}`} />
            Starred
          </button>

          {/* Export */}
          <button
            onClick={handleExport}
            className="px-6 py-3 bg-gray-900 text-white rounded-xl font-medium hover:bg-gray-800
              transition-all duration-200 flex items-center gap-2"
          >
            <Download className="h-5 w-5" />
            Export
          </button>
        </div>
      </div>

      {/* Interactions Timeline */}
      <div className="space-y-4">
        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-500">Loading interactions...</p>
          </div>
        ) : interactions.map((interaction) => (
          <div
            key={interaction.id}
            className="bg-white rounded-2xl border border-gray-200 overflow-hidden
              hover:shadow-lg transition-all duration-300 cursor-pointer group"
            onClick={() => setSelectedInteraction(interaction)}
          >
            <div className="p-6">
              <div className="flex items-start gap-4">
                {/* Avatar */}
                <div className={`w-14 h-14 rounded-full bg-${interaction.contact_color || 'indigo'}-500 flex items-center justify-center text-white font-semibold text-lg shrink-0`}>
                  {interaction.contact_avatar || interaction.contact_name?.substring(0, 2).toUpperCase() || '??'}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors">
                        {interaction.contact_name || 'Unknown'}
                      </h3>
                      <p className="text-sm text-gray-500">{interaction.contact_relationship || 'Contact'}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={(e) => handleToggleStar(e, interaction.id)}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                      >
                        <Star className={`h-5 w-5 ${interaction.starred ? 'fill-yellow-500 text-yellow-500' : 'text-gray-400'}`} />
                      </button>
                    </div>
                  </div>

                  {/* Summary */}
                  <p className="text-gray-600 mb-4 line-clamp-2">{interaction.summary}</p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {interaction.key_topics && interaction.key_topics.map((topic, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded-lg"
                      >
                        {topic}
                      </span>
                    ))}
                  </div>

                  {/* Meta Info */}
                  <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                    <div className={`px-3 py-1 rounded-lg text-xs font-medium border ${getMoodColor(interaction.mood)}`}>
                      {getMoodEmoji(interaction.mood)} {interaction.mood}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {formatTimestamp(interaction.timestamp)}
                    </div>
                    {interaction.duration && <div>Duration: {interaction.duration}</div>}
                    {interaction.location && (
                      <div className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        {interaction.location}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}

        {!loading && interactions.length === 0 && (
          <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center">
            <p className="text-gray-500 text-lg">No interactions found matching your filters</p>
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {selectedInteraction && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-6">
          <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-hidden shadow-2xl">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className={`w-14 h-14 rounded-full bg-${selectedInteraction.contact_color || 'indigo'}-500 flex items-center justify-center text-white font-semibold text-lg`}>
                  {selectedInteraction.contact_avatar || selectedInteraction.contact_name?.substring(0, 2).toUpperCase() || '??'}
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">{selectedInteraction.contact_name || 'Unknown'}</h2>
                  <p className="text-gray-500">{selectedInteraction.contact_relationship || 'Contact'}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedInteraction(null)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="h-6 w-6 text-gray-600" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
              {/* Meta Info */}
              <div className="grid md:grid-cols-2 gap-4 mb-6">
                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-xs text-gray-500 mb-1">Date & Time</p>
                  <p className="font-semibold text-gray-900">
                    {new Date(selectedInteraction.timestamp).toLocaleString()}
                  </p>
                </div>
                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-xs text-gray-500 mb-1">Duration</p>
                  <p className="font-semibold text-gray-900">{selectedInteraction.duration || 'N/A'}</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-xs text-gray-500 mb-1">Location</p>
                  <p className="font-semibold text-gray-900">{selectedInteraction.location || 'Unknown'}</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-xs text-gray-500 mb-1">Emotional Tone</p>
                  <span className={`inline-flex px-3 py-1 rounded-lg text-sm font-medium border ${getMoodColor(selectedInteraction.mood)}`}>
                    {getMoodEmoji(selectedInteraction.mood)} {selectedInteraction.mood}
                  </span>
                </div>
              </div>

              {/* Topics */}
              <div className="mb-6">
                <h3 className="text-sm font-semibold text-gray-900 mb-3">Key Topics</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedInteraction.key_topics && selectedInteraction.key_topics.map((topic, index) => (
                    <span
                      key={index}
                      className="px-3 py-2 bg-indigo-100 text-indigo-700 text-sm font-medium rounded-lg"
                    >
                      {topic}
                    </span>
                  ))}
                </div>
              </div>

              {/* Full Details */}
              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-3">Full Conversation Summary</h3>
                <p className="text-gray-700 leading-relaxed">{selectedInteraction.full_details || selectedInteraction.summary}</p>
              </div>
            </div>

            <div className="p-6 border-t border-gray-200 flex gap-3">
              <button className="flex-1 px-6 py-3 bg-gray-900 text-white rounded-xl font-medium hover:bg-gray-800 transition-colors">
                View Contact Profile
              </button>
              <button className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors">
                Export
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InteractionHistory;
