import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import StarRating from '../components/StarRating';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

const PAGE_SIZE = 5;

const UserStores = () => {
  const { user } = useAuth();
  const [stores, setStores] = useState([]);
  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [sortBy, setSortBy] = useState('name');

  useEffect(() => {
    fetchStores();
  }, [search, page, sortBy]);

  const fetchStores = async () => {
    try {
      const params = {
        search,
        userId: user.id,
        sortBy,
        sortDir: 'asc',
        page,
        size: PAGE_SIZE,
      };
      const res = await api.get('/stores', { params });
      setStores(res.data.content);
      setTotalPages(res.data.totalPages);
      setTotalElements(res.data.totalElements);
    } catch (err) {
      console.log(err);
    }
  };

  const handleSearchInputChange = (e) => {
    setSearchInput(e.target.value);
  };

  const triggerSearch = () => {
    setSearch(searchInput);
    setPage(0);
  };

  const handleSearchKeyDown = (e) => {
    if (e.key === 'Enter') {
      triggerSearch();
    }
  };

  const handleRate = async (storeId, value) => {
    try {
      await api.post('/stores/rate', { storeId, value }, { params: { userId: user.id } });
      fetchStores();
    } catch (err) {
      console.log(err);
    }
  };

  const handleSortChange = (e) => {
    setSortBy(e.target.value);
    setPage(0);
  };

  const goToPage = (p) => {
    if (p < 0 || p >= totalPages) return;
    setPage(p);
  };

  const renderPageButtons = () => {
    const buttons = [];
    for (let i = 0; i < totalPages; i++) {
      buttons.push(
        <button
          key={i}
          className={`page-btn ${i === page ? 'active' : ''}`}
          onClick={() => goToPage(i)}
        >
          {i + 1}
        </button>
      );
    }
    return buttons;
  };

  return (
    <div className="app-container">
      <Navbar />
      <div className="page-wrapper">
        <div className="page-header">
          <div>
            <div className="page-title">Browse Stores</div>
            <div className="page-subtitle">
              {totalElements} store{totalElements !== 1 ? 's' : ''} available — rate the ones you've visited
            </div>
          </div>
        </div>

        <div className="card">
          <div className="filter-bar">
            <div className="search-input-wrap">
              <span className="search-icon">&#128269;</span>
              <input
                className="form-input"
                placeholder="Search stores by name or address..."
                value={searchInput}
                onChange={handleSearchInputChange}
                onKeyDown={handleSearchKeyDown}
              />
            </div>
            <button className="btn btn-primary" onClick={triggerSearch} style={{ flex: '0 0 auto' }}>
              Search
            </button>
            <select className="form-select" value={sortBy} onChange={handleSortChange} style={{ flex: '0 0 200px' }}>
              <option value="name">Sort: Name (A-Z)</option>
              <option value="overallRating">Sort: Rating</option>
            </select>
          </div>
        </div>

        {stores.length === 0 ? (
          <div className="card">
            <div className="empty-state">
              <div className="empty-state-icon">🏬</div>
              <div className="empty-state-title">No stores found</div>
              <div className="text-muted">Try adjusting your search keywords.</div>
            </div>
          </div>
        ) : (
          <div className="store-grid">
            {stores.map((store) => (
              <div className="store-card" key={store.id}>
                <div className="store-card-top">
                  <div className="store-avatar">{store.name.charAt(0).toUpperCase()}</div>
                  <div>
                    <div className="store-name">{store.name}</div>
                    <div className="store-address">{store.address.substring(0, 40) + "..."}</div>
                  </div>
                </div>

                <div className="overall-rating-row">
                  <span className="overall-rating-star">&#9733;</span>
                  <span className="overall-rating-score">{store.overallRating.toFixed(1)}</span>
                  <span className="text-muted">/ 5 overall</span>
                </div>

                <div className="your-rating-section">
                  <div className="your-rating-label">
                    <span>Your Rating</span>
                    {store.userRating ? (
                      <span className="your-rating-value">{store.userRating} / 5</span>
                    ) : (
                      <span className="text-muted">Not rated yet</span>
                    )}
                  </div>
                  <StarRating
                    value={store.userRating || 0}
                    onChange={(val) => handleRate(store.id, val)}
                  />
                </div>
              </div>
            ))}
          </div>
        )}

        {totalPages > 1 && (
          <div className="pagination">
            <button className="page-btn" onClick={() => goToPage(page - 1)} disabled={page === 0}>
              &#8249;
            </button>
            {renderPageButtons()}
            <button className="page-btn" onClick={() => goToPage(page + 1)} disabled={page === totalPages - 1}>
              &#8250;
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserStores;
