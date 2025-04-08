import React, { useState, useEffect } from "react";
import styled from "styled-components";
import colors from "../../styles/colors";
import { FaEdit, FaTrash, FaPlus, FaCheck, FaTimes } from "react-icons/fa";
import { useAuth } from "../../contexts/AuthContext";
import axios from "axios";
import { API_BASE_URL } from "../../config/api";

const Container = styled.div`
    max-width: 1200px;
    margin: 0 auto;
    padding: 2rem;
`;

const Header = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 2rem;

    h1 {
        color: ${colors.primary};
        font-size: 2rem;
    }
`;

const AddServiceButton = styled.button`
    background: ${colors.primary};
    color: white;
    border: none;
    padding: 0.8rem 1.5rem;
    border-radius: 12px;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    transition: all 0.3s ease;

    &:hover {
        background: ${colors.accent};
        transform: translateY(-2px);
    }
`;

const ServicesGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 2rem;
    margin-top: 2rem;
`;

const ServiceCard = styled.div`
    background: white;
    border-radius: 12px;
    padding: 1.5rem;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    position: relative;
`;

const ServiceImage = styled.div`
    width: 100%;
    height: 200px;
    background: ${colors.background};
    margin-bottom: 1rem;
    border-radius: 8px;
    overflow: hidden;
    position: relative;

    img {
        width: 100%;
        height: 100%;
        object-fit: cover;
    }
`;

const ServiceTitle = styled.h3`
    color: ${colors.primary};
    font-size: 1.5rem;
    margin-bottom: 1rem;
`;

const ServiceDescription = styled.p`
    color: ${colors.text};
    margin-bottom: 1rem;
    line-height: 1.6;
`;

const ServiceFeatures = styled.ul`
    list-style: none;
    padding: 0;
    margin: 1rem 0;

    li {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        margin-bottom: 0.5rem;
        color: ${colors.text};
    }
`;

const ServicePrice = styled.div`
    color: ${colors.primary};
    font-weight: bold;
    font-size: 1.2rem;
    margin: 1rem 0;
`;

const ActionButtons = styled.div`
    display: flex;
    gap: 1rem;
    margin-top: 1rem;
`;

const Button = styled.button`
    padding: 0.5rem 1rem;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    transition: all 0.3s ease;

    &.edit {
        background: ${colors.accent};
        color: white;
    }

    &.delete {
        background: ${colors.error};
        color: white;
    }

    &:hover {
        opacity: 0.9;
        transform: translateY(-2px);
    }
`;

const Modal = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
`;

const ModalContent = styled.div`
    background: white;
    padding: 2rem;
    border-radius: 12px;
    width: 90%;
    max-width: 500px;
    position: relative;
`;

const CloseButton = styled.button`
    position: absolute;
    top: 1rem;
    right: 1rem;
    background: none;
    border: none;
    font-size: 1.5rem;
    cursor: pointer;
    color: ${colors.text};
`;

const Form = styled.form`
    display: flex;
    flex-direction: column;
    gap: 1rem;
`;

const FormGroup = styled.div`
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
`;

const Label = styled.label`
    color: ${colors.text};
    font-weight: 500;
`;

const Input = styled.input`
    padding: 0.8rem;
    border: 1px solid ${colors.border};
    border-radius: 4px;
    font-size: 1rem;
`;

const TextArea = styled.textarea`
    padding: 0.8rem;
    border: 1px solid ${colors.border};
    border-radius: 4px;
    font-size: 1rem;
    min-height: 100px;
    resize: vertical;
`;

const FeatureInput = styled.div`
    display: flex;
    gap: 0.5rem;
    margin-bottom: 0.5rem;
`;

const SubmitButton = styled.button`
    background: ${colors.primary};
    color: white;
    border: none;
    padding: 1rem;
    border-radius: 4px;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    margin-top: 1rem;

    &:hover {
        background: ${colors.accent};
    }
`;

const ServicesManagement = () => {
    const { currentUser } = useAuth();
    const [services, setServices] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingService, setEditingService] = useState(null);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        price: '',
        features: [''],
        image: null
    });

    useEffect(() => {
        fetchServices();
    }, []);

    const fetchServices = async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/services`, {
                headers: {
                    Authorization: `Bearer ${await currentUser.getIdToken()}`
                }
            });
            setServices(response.data || []);
        } catch (error) {
            console.error('Error fetching services:', error);
        }
    };

    const handleOpenModal = (service = null) => {
        if (service) {
            setEditingService(service);
            setFormData({
                title: service.title,
                description: service.description,
                price: service.price,
                features: service.features,
                image: null
            });
        } else {
            setEditingService(null);
            setFormData({
                title: '',
                description: '',
                price: '',
                features: [''],
                image: null
            });
        }
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingService(null);
        setFormData({
            title: '',
            description: '',
            price: '',
            features: [''],
            image: null
        });
    };

    const handleAddFeature = () => {
        setFormData({
            ...formData,
            features: [...formData.features, '']
        });
    };

    const handleRemoveFeature = (index) => {
        const newFeatures = formData.features.filter((_, i) => i !== index);
        setFormData({
            ...formData,
            features: newFeatures
        });
    };

    const handleFeatureChange = (index, value) => {
        const newFeatures = [...formData.features];
        newFeatures[index] = value;
        setFormData({
            ...formData,
            features: newFeatures
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const formDataToSend = new FormData();
            formDataToSend.append('title', formData.title);
            formDataToSend.append('description', formData.description);
            formDataToSend.append('price', formData.price);
            formDataToSend.append('features', JSON.stringify(formData.features));
            if (formData.image) {
                formDataToSend.append('image', formData.image);
            }

            if (editingService) {
                await axios.put(`${API_BASE_URL}/services/${editingService.id}`, formDataToSend, {
                    headers: {
                        Authorization: `Bearer ${await currentUser.getIdToken()}`,
                        'Content-Type': 'multipart/form-data'
                    }
                });
            } else {
                await axios.post(`${API_BASE_URL}/services`, formDataToSend, {
                    headers: {
                        Authorization: `Bearer ${await currentUser.getIdToken()}`,
                        'Content-Type': 'multipart/form-data'
                    }
                });
            }

            handleCloseModal();
            fetchServices();
        } catch (error) {
            console.error('Error saving service:', error);
        }
    };

    const handleDelete = async (serviceId) => {
        if (window.confirm('Are you sure you want to delete this service?')) {
            try {
                await axios.delete(`${API_BASE_URL}/services/${serviceId}`, {
                    headers: {
                        Authorization: `Bearer ${await currentUser.getIdToken()}`
                    }
                });
                fetchServices();
            } catch (error) {
                console.error('Error deleting service:', error);
            }
        }
    };

    return (
        <Container>
            <Header>
                <h1>Manage Services</h1>
                <AddServiceButton onClick={() => handleOpenModal()}>
                    <FaPlus /> Add New Service
                </AddServiceButton>
            </Header>

            <ServicesGrid>
                {services.map((service) => (
                    <ServiceCard key={service.id}>
                        <ServiceImage>
                            {service.image && <img src={service.image} alt={service.title} />}
                        </ServiceImage>
                        <ServiceTitle>{service.title}</ServiceTitle>
                        <ServiceDescription>{service.description}</ServiceDescription>
                        <ServiceFeatures>
                            {service.features.map((feature, index) => (
                                <li key={index}>
                                    <FaCheck /> {feature}
                                </li>
                            ))}
                        </ServiceFeatures>
                        <ServicePrice>${service.price}</ServicePrice>
                        <ActionButtons>
                            <Button className="edit" onClick={() => handleOpenModal(service)}>
                                <FaEdit /> Edit
                            </Button>
                            <Button className="delete" onClick={() => handleDelete(service.id)}>
                                <FaTrash /> Delete
                            </Button>
                        </ActionButtons>
                    </ServiceCard>
                ))}
            </ServicesGrid>

            {isModalOpen && (
                <Modal>
                    <ModalContent>
                        <CloseButton onClick={handleCloseModal}>
                            <FaTimes />
                        </CloseButton>
                        <h2>{editingService ? 'Edit Service' : 'Add New Service'}</h2>
                        <Form onSubmit={handleSubmit}>
                            <FormGroup>
                                <Label>Title</Label>
                                <Input
                                    type="text"
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    required
                                />
                            </FormGroup>
                            <FormGroup>
                                <Label>Description</Label>
                                <TextArea
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    required
                                />
                            </FormGroup>
                            <FormGroup>
                                <Label>Price</Label>
                                <Input
                                    type="text"
                                    value={formData.price}
                                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                    required
                                />
                            </FormGroup>
                            <FormGroup>
                                <Label>Features</Label>
                                {formData.features.map((feature, index) => (
                                    <FeatureInput key={index}>
                                        <Input
                                            type="text"
                                            value={feature}
                                            onChange={(e) => handleFeatureChange(index, e.target.value)}
                                            required
                                        />
                                        <Button
                                            type="button"
                                            className="delete"
                                            onClick={() => handleRemoveFeature(index)}
                                        >
                                            <FaTimes />
                                        </Button>
                                    </FeatureInput>
                                ))}
                                <Button type="button" onClick={handleAddFeature}>
                                    <FaPlus /> Add Feature
                                </Button>
                            </FormGroup>
                            <FormGroup>
                                <Label>Image</Label>
                                <Input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => setFormData({ ...formData, image: e.target.files[0] })}
                                />
                            </FormGroup>
                            <SubmitButton type="submit">
                                {editingService ? 'Update Service' : 'Add Service'}
                            </SubmitButton>
                        </Form>
                    </ModalContent>
                </Modal>
            )}
        </Container>
    );
};

export default ServicesManagement; 