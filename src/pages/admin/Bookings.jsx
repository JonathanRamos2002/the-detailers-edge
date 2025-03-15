import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { format } from 'date-fns';
import { getBookings, cancelBooking } from '../../services/neetocalService';

const Container = styled.div`
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
  background: #FFFFFF;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
`;

const Title = styled.h1`
  font-size: 2rem;
  color: #181722;
`;

const FilterBar = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
`;

const Select = styled.select`
  padding: 0.5rem;
  border: 1px solid #393F4A;
  border-radius: 4px;
  min-width: 150px;
  color: #181722;
  background: #FFFFFF;
  
  &:focus {
    outline: none;
    border-color: #3D5A80;
  }
`;

const Input = styled.input`
  padding: 0.5rem;
  border: 1px solid #393F4A;
  border-radius: 4px;
  min-width: 200px;
  color: #181722;
  background: #FFFFFF;
  
  &:focus {
    outline: none;
    border-color: #3D5A80;
  }
  
  &::placeholder {
    color: #393F4A;
  }
`;

const BookingsList = styled.div`
  display: grid;
  gap: 1rem;
`;

const BookingCard = styled.div`
  background: #FFFFFF;
  border: 1px solid #393F4A;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 2px 4px rgba(24, 23, 34, 0.05);
`;

const BookingHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`;

const BookingId = styled.span`
  color: #393F4A;
  font-size: 0.9rem;
`;

const BookingStatus = styled.span`
  padding: 0.25rem 0.75rem;
  border-radius: 999px;
  font-size: 0.875rem;
  font-weight: 500;
  background-color: ${props => {
    switch (props.status) {
      case 'confirmed': return '#3D5A80';
      case 'cancelled': return '#E63946';
      case 'incomplete': return '#393F4A';
      default: return '#393F4A';
    }
  }};
  color: #FFFFFF;
`;

const BookingInfo = styled.div`
  margin-top: 1rem;
  
  p {
    margin: 0.5rem 0;
    color: #393F4A;
  }
  
  strong {
    color: #181722;
  }
`;

const BookingActions = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-top: 1.5rem;
`;

const ActionButton = styled.button`
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  
  ${props => props.variant === 'primary' && `
    background-color: #181722;
    color: #FFFFFF;
    
    &:hover:not(:disabled) {
      background-color: #393F4A;
    }
  `}
  
  ${props => props.variant === 'secondary' && `
    background-color: #3D5A80;
    color: #FFFFFF;
    
    &:hover:not(:disabled) {
      background-color: #2d4360;
    }
  `}
  
  ${props => props.variant === 'danger' && `
    background-color: #E63946;
    color: #FFFFFF;
    
    &:hover:not(:disabled) {
      background-color: #c62936;
    }
  `}
`;

const Pagination = styled.div`
  display: flex;
  justify-content: center;
  gap: 0.5rem;
  margin-top: 2rem;
  color: #181722;
`;

const LoadingSpinner = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 200px;
  
  &:after {
    content: '';
    width: 32px;
    height: 32px;
    border: 4px solid #393F4A;
    border-top: 4px solid #3D5A80;
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const ErrorMessage = styled.div`
  color: #FFFFFF;
  background-color: #E63946;
  padding: 1rem;
  border-radius: 4px;
  margin: 1rem 0;
`;

const Bookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    type: '',
    client_email: '',
    page_number: 1,
    page_size: 10
  });
  const [pagination, setPagination] = useState({
    total_records: 0,
    total_pages: 0,
    current_page_number: 1,
    page_size: 10
  });

  const fetchBookings = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getBookings(filters);
      setBookings(response.bookings);
      setPagination(response.pagination);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, [filters]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value,
      page_number: 1 // Reset to first page when filters change
    }));
  };

  const handlePageChange = (newPage) => {
    setFilters(prev => ({
      ...prev,
      page_number: newPage
    }));
  };

  const handleCancelBooking = async (bookingId) => {
    try {
      await cancelBooking(bookingId);
      fetchBookings(); // Refresh the list
    } catch (err) {
      setError(err.message);
    }
  };

  const formatDateTime = (isoString) => {
    return format(new Date(isoString), 'MMM d, yyyy h:mm a');
  };

  if (loading) {
    return (
      <Container>
        <LoadingSpinner />
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <ErrorMessage>{error}</ErrorMessage>
        <ActionButton variant="secondary" onClick={fetchBookings}>
          Try Again
        </ActionButton>
      </Container>
    );
  }

  return (
    <Container>
      <Header>
        <Title>Bookings</Title>
      </Header>

      <FilterBar>
        <Select
          name="type"
          value={filters.type}
          onChange={handleFilterChange}
        >
          <option value="">All Bookings</option>
          <option value="upcoming">Upcoming</option>
          <option value="past">Past</option>
          <option value="cancelled">Cancelled</option>
          <option value="incomplete">Incomplete</option>
        </Select>

        <Input
          type="email"
          name="client_email"
          value={filters.client_email}
          onChange={handleFilterChange}
          placeholder="Filter by client email"
        />
      </FilterBar>

      <BookingsList>
        {bookings.map(booking => (
          <BookingCard key={booking.id}>
            <BookingHeader>
              <BookingId>Booking ID: {booking.sid}</BookingId>
              <BookingStatus status={booking.status}>
                {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
              </BookingStatus>
            </BookingHeader>

            <BookingInfo>
              <p><strong>Customer:</strong> {booking.name}</p>
              <p><strong>Email:</strong> {booking.email}</p>
              <p><strong>Service:</strong> {booking.meeting?.name}</p>
              <p><strong>Start:</strong> {formatDateTime(booking.starts_at)}</p>
              <p><strong>End:</strong> {formatDateTime(booking.ends_at)}</p>
              <p><strong>Location:</strong> {booking.spot_details}</p>
            </BookingInfo>

            <BookingActions>
              <ActionButton
                variant="primary"
                onClick={() => window.open(booking.admin_booking_url, '_blank')}
              >
                View in Detail
              </ActionButton>
              
              {booking.status === 'confirmed' && (
                <ActionButton
                  variant="danger"
                  onClick={() => handleCancelBooking(booking.sid)}
                >
                  Cancel Booking
                </ActionButton>
              )}
            </BookingActions>
          </BookingCard>
        ))}
      </BookingsList>

      {bookings.length === 0 && (
        <p>No bookings found.</p>
      )}

      <Pagination>
        <ActionButton
          variant="secondary"
          disabled={pagination.current_page_number <= 1}
          onClick={() => handlePageChange(pagination.current_page_number - 1)}
        >
          Previous
        </ActionButton>
        
        <span style={{ padding: '0.5rem' }}>
          Page {pagination.current_page_number} of {pagination.total_pages}
        </span>
        
        <ActionButton
          variant="secondary"
          disabled={pagination.current_page_number >= pagination.total_pages}
          onClick={() => handlePageChange(pagination.current_page_number + 1)}
        >
          Next
        </ActionButton>
      </Pagination>
    </Container>
  );
};

export default Bookings; 