import React from 'react';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import './Pagination.css';

const Pagination = ({ 
  currentPage, 
  totalPages, 
  onPageChange, 
  totalElements,
  pageSize 
}) => {
  // Luôn hiển thị thông tin, nhưng chỉ hiển thị nút chuyển trang khi có nhiều hơn 1 trang
  const showControls = totalPages > 1;

  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;
    
    if (totalPages <= maxVisible) {
      // Hiển thị tất cả các trang
      for (let i = 0; i < totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Hiển thị một phần các trang
      if (currentPage < 3) {
        // Đầu danh sách
        for (let i = 0; i < maxVisible - 1; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages - 1);
      } else if (currentPage > totalPages - 4) {
        // Cuối danh sách
        pages.push(0);
        pages.push('...');
        for (let i = totalPages - (maxVisible - 1); i < totalPages; i++) {
          pages.push(i);
        }
      } else {
        // Giữa danh sách
        pages.push(0);
        pages.push('...');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages - 1);
      }
    }
    
    return pages;
  };

  const startItem = currentPage * pageSize + 1;
  const endItem = Math.min((currentPage + 1) * pageSize, totalElements);

  return (
    <div className="pagination-container">
      {showControls && (
        <div className="pagination-controls">
          <button
            className="pagination-btn"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 0}
            title="Trang trước"
          >
            <FiChevronLeft />
          </button>
          
          {getPageNumbers().map((page, index) => {
            if (page === '...') {
              return (
                <span key={`ellipsis-${index}`} className="pagination-ellipsis">
                  ...
                </span>
              );
            }
            
            return (
              <button
                key={page}
                className={`pagination-btn ${currentPage === page ? 'active' : ''}`}
                onClick={() => onPageChange(page)}
              >
                {page + 1}
              </button>
            );
          })}
          
          <button
            className="pagination-btn"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage >= totalPages - 1}
            title="Trang sau"
          >
            <FiChevronRight />
          </button>
        </div>
      )}
    </div>
  );
};

export default Pagination;

