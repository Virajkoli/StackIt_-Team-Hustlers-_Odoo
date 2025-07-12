'use client';

import { forwardRef, useCallback, useEffect, useState, memo } from 'react';
import { User } from 'lucide-react';
import { useDebounce } from '../lib/hooks';

const UserItem = memo(({ item, onClick, isSelected }) => (
  <button
    className={`flex items-center gap-2 w-full px-3 py-2 text-sm hover:bg-gray-100 cursor-pointer ${
      isSelected ? 'bg-blue-50' : ''
    }`}
    onClick={onClick}
  >
    <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
      {item.image ? (
        <img src={item.image} alt="" className="w-8 h-8 rounded-full" />
      ) : (
        <User className="w-4 h-4 text-blue-600" />
      )}
    </div>
    <div className="flex flex-col items-start min-w-0">
      <p className="text-sm font-medium text-gray-900 truncate">{item.name}</p>
      {item.email && (
        <p className="text-xs text-gray-500 truncate">{item.email}</p>
      )}
    </div>
  </button>
));

UserItem.displayName = 'UserItem';

const UserMention = forwardRef((props, ref) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const debouncedQuery = useDebounce(props.query, 300);

  const fetchUsers = useCallback(async (query) => {
    if (!query) {
      setItems([]);
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`/api/users/search?query=${encodeURIComponent(query)}`);
      if (response.ok) {
        const data = await response.json();
        setItems(data);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers(debouncedQuery);
  }, [debouncedQuery, fetchUsers]);

  const onKeyDown = useCallback(
    (event) => {
      if (items.length === 0) return false;

      if (event.key === 'ArrowUp') {
        event.preventDefault();
        setSelectedIndex((current) =>
          current > 0 ? current - 1 : items.length - 1
        );
        return true;
      }

      if (event.key === 'ArrowDown') {
        event.preventDefault();
        setSelectedIndex((current) =>
          current < items.length - 1 ? current + 1 : 0
        );
        return true;
      }

      if (event.key === 'Enter') {
        event.preventDefault();
        selectItem(selectedIndex);
        return true;
      }

      return false;
    },
    [items.length, selectedIndex]
  );

  const selectItem = useCallback(
    (index) => {
      const item = items[index];
      if (item) {
        props.command?.({ id: item.id, label: item.name });
      }
    },
    [items, props]
  );

  if (loading) {
    return (
      <div className="p-2 text-sm text-gray-500">
        Loading...
      </div>
    );
  }

  if (!items.length) {
    return (
      <div className="p-2 text-sm text-gray-500">
        {props.query ? 'No users found' : 'Type to search users'}
      </div>
    );
  }

  return (
    <div ref={ref} className="overflow-hidden rounded-lg shadow-lg border border-gray-200 bg-white max-h-[300px] overflow-y-auto">
      {items.map((item, index) => (
        <UserItem
          key={item.id}
          item={item}
          isSelected={index === selectedIndex}
          onClick={() => selectItem(index)}
        />
      ))}
    </div>
  );
});

UserMention.displayName = 'UserMention';

export default memo(UserMention);
