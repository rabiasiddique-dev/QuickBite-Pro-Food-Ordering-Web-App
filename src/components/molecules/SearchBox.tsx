import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, Clock, TrendingUp } from 'lucide-react';
import { SearchInput, Text, Button } from '@/components/atoms';
import type { BaseComponentProps } from '@/types';

interface SearchBoxProps extends BaseComponentProps {
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  onSearch?: (query: string) => void;
  onClear?: () => void;
  suggestions?: SearchSuggestion[];
  recentSearches?: string[];
  showSuggestions?: boolean;
  loading?: boolean;
  debounceMs?: number;
}

interface SearchSuggestion {
  id: string;
  text: string;
  type?: 'food' | 'category' | 'restaurant';
  count?: number;
}

const SearchBox: React.FC<SearchBoxProps> = ({
  placeholder = 'Search for food, restaurants...',
  value,
  onChange,
  onSearch,
  onClear,
  suggestions = [],
  recentSearches = [],
  showSuggestions = true,
  loading = false,
  debounceMs = 300,
  className = '',
  ...props
}) => {
  const [inputValue, setInputValue] = useState(value || '');
  const [isFocused, setIsFocused] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Debounced search
  useEffect(() => {
    if (!inputValue.trim()) return;

    const timer = setTimeout(() => {
      onChange?.(inputValue);
    }, debounceMs);

    return () => clearTimeout(timer);
  }, [inputValue, debounceMs, onChange]);

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
        setIsFocused(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    if (newValue.trim()) {
      setShowDropdown(true);
    }
  };

  const handleInputFocus = () => {
    setIsFocused(true);
    if (inputValue.trim() || recentSearches.length > 0) {
      setShowDropdown(true);
    }
  };

  const handleSearch = (query?: string) => {
    const searchQuery = query || inputValue;
    if (searchQuery.trim()) {
      onSearch?.(searchQuery);
      setShowDropdown(false);
      inputRef.current?.blur();
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInputValue(suggestion);
    handleSearch(suggestion);
  };

  const handleClear = () => {
    setInputValue('');
    onClear?.();
    setShowDropdown(false);
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSearch();
    } else if (e.key === 'Escape') {
      setShowDropdown(false);
      inputRef.current?.blur();
    }
  };

  const filteredSuggestions = suggestions.filter(suggestion =>
    suggestion.text.toLowerCase().includes(inputValue.toLowerCase())
  );

  const hasResults = filteredSuggestions.length > 0 || recentSearches.length > 0;

  return (
    <div className={`relative w-full max-w-2xl ${className}`} {...props}>
      {/* Search Input */}
      <div className="relative">
        <SearchInput
          ref={inputRef}
          placeholder={placeholder}
          value={inputValue}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          onKeyDown={handleKeyDown}
          className="w-full pl-12 pr-12"
          disabled={loading}
        />

        {/* Search Icon */}
        <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
          {loading ? (
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            >
              <Search className="h-5 w-5 text-gray-400" />
            </motion.div>
          ) : (
            <Search className="h-5 w-5 text-gray-400" />
          )}
        </div>

        {/* Clear Button */}
        {inputValue && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={handleClear}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <X className="h-4 w-4 text-gray-400" />
          </motion.button>
        )}
      </div>

      {/* Dropdown */}
      <AnimatePresence>
        {showSuggestions && showDropdown && (isFocused || inputValue) && hasResults && (
          <motion.div
            ref={dropdownRef}
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden z-50 max-h-80 overflow-y-auto custom-scrollbar"
          >
            {/* Recent Searches */}
            {!inputValue && recentSearches.length > 0 && (
              <div className="p-4 border-b border-gray-100 dark:border-gray-700">
                <div className="flex items-center space-x-2 mb-3">
                  <Clock className="h-4 w-4 text-gray-400" />
                  <Text size="sm" weight="medium" color="muted">
                    Recent Searches
                  </Text>
                </div>
                <div className="space-y-1">
                  {recentSearches.slice(0, 5).map((search, index) => (
                    <motion.button
                      key={`recent-${index}`}
                      onClick={() => handleSuggestionClick(search)}
                      className="w-full flex items-center justify-between px-3 py-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-left"
                      whileHover={{ x: 5 }}
                    >
                      <Text size="sm">{search}</Text>
                    </motion.button>
                  ))}
                </div>
              </div>
            )}

            {/* Suggestions */}
            {inputValue && filteredSuggestions.length > 0 && (
              <div className="p-4">
                <div className="flex items-center space-x-2 mb-3">
                  <TrendingUp className="h-4 w-4 text-gray-400" />
                  <Text size="sm" weight="medium" color="muted">
                    Suggestions
                  </Text>
                </div>
                <div className="space-y-1">
                  {filteredSuggestions.slice(0, 8).map((suggestion) => (
                    <motion.button
                      key={suggestion.id}
                      onClick={() => handleSuggestionClick(suggestion.text)}
                      className="w-full flex items-center justify-between px-3 py-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-left"
                      whileHover={{ x: 5 }}
                    >
                      <div className="flex items-center space-x-3">
                        <Search className="h-4 w-4 text-gray-400" />
                        <div>
                          <Text size="sm">{suggestion.text}</Text>
                          {suggestion.type && (
                            <Text size="xs" color="muted" className="capitalize">
                              {suggestion.type}
                            </Text>
                          )}
                        </div>
                      </div>
                      {suggestion.count && (
                        <Text size="xs" color="muted">
                          {suggestion.count} results
                        </Text>
                      )}
                    </motion.button>
                  ))}
                </div>
              </div>
            )}

            {/* No Results */}
            {inputValue && filteredSuggestions.length === 0 && (
              <div className="p-6 text-center">
                <Search className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                <Text color="muted">No suggestions found</Text>
                <Text size="sm" color="muted">
                  Try searching for something else
                </Text>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SearchBox;