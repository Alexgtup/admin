import React, { useState, useEffect } from 'react';
import {
  CCard,
  CCardBody,
  CCardHeader,
  CButton,
  CTable,
  CTableBody,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableDataCell,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
} from '@coreui/react';
import axios from 'axios';

const CardsManagement = () => {
  const [cards, setCards] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [currentCard, setCurrentCard] = useState({ id: '', name: '', description: '', upgradeCost: 0 });

  useEffect(() => {
    fetchCards();
  }, []);

  const fetchCards = async () => {
    try {
      const response = await axios.get('http://localhost:3001/api/cards');
      setCards(response.data || []);
    } catch (error) {
      console.error('Ошибка при попытке получить карточки:', error.message);
    }
  };

  const openEditModal = (card) => {
    setCurrentCard(card);
    setModalVisible(true);
  };

  const openAddModal = () => {
    setCurrentCard({ id: '', name: '', description: '', upgradeCost: 0 });
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  const handleSave = async () => {
    try {
      if (!currentCard.name || !currentCard.description || currentCard.upgradeCost === undefined) {
        console.error('Поля name, description и upgradeCost обязательны для заполнения.');
        return;
      }

      const formData = new FormData();
      formData.append('name', currentCard.name);
      formData.append('description', currentCard.description);
      formData.append('upgradeCost', currentCard.upgradeCost);
      if (currentCard.image) {
        formData.append('image', currentCard.image);
      }

      if (currentCard.id) {
        await axios.put(`http://localhost:3001/api/cards/${currentCard.id}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      } else {
        await axios.post('http://localhost:3001/api/cards', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      }

      setModalVisible(false);
      fetchCards();
    } catch (error) {
      console.error('Ошибка при сохранении карточки:', error.message);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:3001/api/cards/${id}`);
      fetchCards();
    } catch (error) {
      console.error('Ошибка при удалении карточки:', error.message);
    }
  };

  return (
    <CCard>
      <CCardHeader>
        Управление карточками
        <CButton color="primary" className="float-right" onClick={openAddModal}>
          Добавить карточку
        </CButton>
      </CCardHeader>
      <CCardBody>
        <CTable hover>
          <CTableHead>
            <CTableRow>
              <CTableHeaderCell>ID</CTableHeaderCell>
              <CTableHeaderCell>Название</CTableHeaderCell>
              <CTableHeaderCell>Описание</CTableHeaderCell>
              <CTableHeaderCell>Стоимость прокачки</CTableHeaderCell>
              <CTableHeaderCell>Действия</CTableHeaderCell>
            </CTableRow>
          </CTableHead>
          <CTableBody>
            {cards.map((card) => (
              <CTableRow key={card.id}>
                <CTableDataCell>{card.id}</CTableDataCell>
                <CTableDataCell>{card.name}</CTableDataCell>
                <CTableDataCell>{card.description}</CTableDataCell>
                <CTableDataCell>{card.upgradeCost}</CTableDataCell>
                <CTableDataCell>
                  <CButton color="info" onClick={() => openEditModal(card)}>
                    Редактировать
                  </CButton>{' '}
                  <CButton color="danger" onClick={() => handleDelete(card.id)}>
                    Удалить
                  </CButton>
                </CTableDataCell>
              </CTableRow>
            ))}
          </CTableBody>
        </CTable>
        <CModal visible={modalVisible} onClose={closeModal}>
          <CModalHeader>
            <CModalTitle>
              {currentCard.id ? 'Редактирование карточки' : 'Добавление карточки'}
            </CModalTitle>
          </CModalHeader>
          <CModalBody>
            <div className="form-group">
              <label htmlFor="image">Изображение</label>
              <input
                type="file"
                className="form-control"
                id="image"
                onChange={(e) => setCurrentCard({ ...currentCard, image: e.target.files[0] })}
              />
            </div>

            <div className="form-group">
              <label htmlFor="name">Название</label>
              <input
                type="text"
                className="form-control"
                id="name"
                value={currentCard.name || ''}
                onChange={(e) => setCurrentCard({ ...currentCard, name: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label htmlFor="description">Описание</label>
              <input
                type="text"
                className="form-control"
                id="description"
                value={currentCard.description || ''}
                onChange={(e) => setCurrentCard({ ...currentCard, description: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label htmlFor="upgradeCost">Стоимость прокачки</label>
              <input
                type="number"
                className="form-control"
                id="upgradeCost"
                value={currentCard.upgradeCost || 0}
                onChange={(e) => setCurrentCard({ ...currentCard, upgradeCost: e.target.value })}
              />
            </div>
          </CModalBody>
          <CModalFooter>
            <CButton color="primary" onClick={handleSave}>
              {currentCard.id ? 'Сохранить изменения' : 'Добавить карточку'}
            </CButton>{' '}
            <CButton color="secondary" onClick={closeModal}>
              Отмена
            </CButton>
          </CModalFooter>
        </CModal>
      </CCardBody>
    </CCard>
  );
};

export default CardsManagement;
