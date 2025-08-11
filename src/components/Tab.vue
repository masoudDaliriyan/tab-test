<script setup>
import { useTabStore } from '../stores/tabStore'
import { ref } from 'vue'

const store = useTabStore()
const draggedCard = ref(null)

const onDragStart = (e, cardIndex, tabId) => {
  // Only allow dragging in first tab
  if (tabId !== 0) {
    e.preventDefault()
    return
  }
  
  e.dataTransfer.setData('text/plain', cardIndex)
  draggedCard.value = { cardIndex, tabId }
  e.target.style.opacity = '0.5'
}

const onDragEnd = (e) => {
  e.target.style.opacity = '1'
  draggedCard.value = null
}

const onDragOver = (e, tabId) => {
  // Only allow drop in first tab
  if (tabId !== 0) {
    return
  }
  e.preventDefault()
  e.currentTarget.style.borderColor = '#007bff'
}

const onDragLeave = (e) => {
  e.currentTarget.style.borderColor = '#e0e0e0'
}

const onDrop = (e, targetIndex, targetTabId) => {
  // Only allow drop in first tab
  if (targetTabId !== 0) {
    return
  }
  
  e.preventDefault()
  e.currentTarget.style.borderColor = '#e0e0e0'
  
  const sourceIndex = parseInt(e.dataTransfer.getData('text/plain'))
  
  if (sourceIndex !== targetIndex) {
    store.moveCard(sourceIndex, targetIndex)
  }
}
</script>

<template>
  <div class="tab-container">
    <div class="tab-headers">
      <button 
        v-for="tab in store.tabs" 
        :key="tab.id"
        @click="store.switchTab(tab.id)"
        :class="{ active: store.activeTab === tab.id }"
        class="tab-button"
      >
        {{ tab.title }}
      </button>
    </div>
    <div class="tab-content">
      <div v-for="tab in store.tabs" :key="tab.id" v-show="store.activeTab === tab.id">
        <div class="cards-grid">
          <div 
            v-for="(card, index) in tab.cards" 
            :key="card.id"
            class="card"
            :class="{ 'draggable': tab.id === 0, 'non-draggable': tab.id === 1 }"
            :draggable="tab.id === 0"
            @dragstart="onDragStart($event, index, tab.id)"
            @dragend="onDragEnd"
            @dragover="onDragOver($event, tab.id)"
            @dragleave="onDragLeave"
            @drop="onDrop($event, index, tab.id)"
          >
            <img :src="`/${card.icon}`" :alt="card.title" class="card-icon" />
            <h3>{{ card.title }}</h3>
            <p>{{ card.content }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.tab-container {
  max-width: 800px;
  margin: 0 auto;
  direction: rtl;
}

.tab-headers {
  margin: 0 auto;
  display: flex;
  background-color: #fff;
  width: 280px;
  border-radius: 30px;
  overflow: hidden;
}

.tab-button {
  flex: 1;
  padding: 12px 20px;
  border: none;
  background: none;
  cursor: pointer;
  font-size: 20px;
  transition: background-color 0.3s;
}

.tab-button:hover {
  background-color: rgb(5 165 147);
}

.tab-button.active {
  background-color:rgb(5 165 147);
  color: white;
}

.tab-icon {
  width: 20px;
  height: 20px;
  margin-right: 8px;
  vertical-align: middle;
}

.tab-content {
  padding: 20px;
  min-height: 300px;
}

.cards-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
  height: 100%;
}

.card {
  background: white;
  border-radius: 8px;
  padding: 16px;
  transition: all 0.3s ease;
  min-height: 120px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.card.draggable {
  cursor: grab;
}

.card.draggable:hover {
  border-color: #007bff;
  box-shadow: 0 4px 8px rgba(0, 123, 255, 0.2);
}

.card.draggable:active {
  cursor: grabbing;
}

.card.non-draggable {
  cursor: default;
  opacity: 0.8;
}

.card h3 {
  margin: 0 0 8px 0;
  color: #333;
}

.card p {
  margin: 0;
  color: #666;
  font-size: 14px;
}

.card-icon {
  width: 42px;
  height: 42px;
  margin-bottom: 12px;
  display: block;
}
</style> 