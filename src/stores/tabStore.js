import { defineStore } from 'pinia';

// Shared cards configuration
const SHARED_CARDS = [
    { id: 1, title: 'غافلگیری مخاطب', content: 'برند خلاقانه و با مزه وارد داستان می‌شود و لبخند مخاطب را جلب می‌کند.', icon: 'smiley-x-eyes-duotone 1.png' },
    { id: 2, title: 'ماندگاری', content: 'برند در داستان طنز، مثل یک جوک خوب در ذهن می‌ماند.', icon: 'heartbeat-duotone 1.png' },
    { id: 3, title: 'تعامل بیشتر', content: 'اشاره مستقیم، بحث‌برانگیز است و تعامل مخاطبان را افزایش می‌دهد.', icon: 'brain-duotone (1) 1.png' },
    { id: 4, title: 'ارتباط احساسی', content: 'حضور در موقعیت طنز، حس مثبت و صمیمیت برند را تقویت می‌کند.', icon: 'armchair-duotone 1.png' }
];

// Default tabs configuration
const DEFAULT_TABS = [
    {
        id: 1,
        title: 'مستقیم',
        icon: 'heartbeat-duotone 1.png',
        cards: [...SHARED_CARDS]
    },
    {
        id: 0,
        title: 'غیر مستقیم',
        icon: 'brain-duotone (1) 1.png',
        cards: [...SHARED_CARDS]
    }
];

const STORAGE_KEY = 'tabState';

const getDefaultTabs = () => DEFAULT_TABS.map(tab => ({ ...tab, cards: [...tab.cards] }));
const getDefaultState = () => ({ activeTab: 0, tabs: getDefaultTabs() });

export const useTabStore = defineStore('tab', {
    state: () =>
    {
        const defaultState = getDefaultState();
        try
        {
            const saved = localStorage.getItem(STORAGE_KEY);
            if (saved)
            {
                const state = JSON.parse(saved);
                return state;
            }
        } catch (error)
        {
            console.error('Failed to load state:', error);
        }
        return defaultState;
    },
    getters: {
        currentTab: (state) => state.tabs.find(tab => tab.id === state.activeTab),
        firstTab: (state) => state.tabs.find(tab => tab.id === 0),
        secondTab: (state) => state.tabs.find(tab => tab.id === 1),
        isFirstTabActive: (state) => state.activeTab === 0
    },
    actions: {
        switchTab(tabId)
        {
            if (tabId !== this.activeTab)
            {
                this.activeTab = tabId;
                this.saveState();
            }
        },
        moveCard(fromIndex, toIndex)
        {
            if (!this.firstTab || fromIndex === toIndex)
            {
                return;
            }
            const length = this.firstTab.cards.length;
            if (fromIndex < 0 || fromIndex >= length || toIndex < 0 || toIndex >= length)
            {
                return;
            }
            const movedCard = this.firstTab.cards[fromIndex];
            this.firstTab.cards.splice(fromIndex, 1);
            this.firstTab.cards.splice(toIndex, 0, movedCard);
            this.syncSecondTab(toIndex, movedCard.id);
            this.saveState();
        },
        syncSecondTab(toIndex, cardId)
        {
            if (!this.secondTab)
            {
                return;
            }
            const cards = this.secondTab.cards;
            const cardIndex = cards.findIndex(card => card.id === cardId);
            if (cardIndex !== -1)
            {
                const [card] = cards.splice(cardIndex, 1);
                const targetIndex = Math.max(0, Math.min(toIndex, cards.length));
                cards.splice(targetIndex, 0, card);
            }
        },
        resetState()
        {
            this.tabs = getDefaultTabs();
            this.activeTab = 0;
            this.saveState();
        },
        saveState()
        {
            try
            {
                const state = {
                    activeTab: this.activeTab,
                    tabs: this.tabs
                };
                localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
            } catch (error)
            {
                console.error('Failed to save state:', error);
            }
        },
        loadState()
        {
            try
            {
                const saved = localStorage.getItem(STORAGE_KEY);

                if (!saved)
                {
                    this.resetState();
                    return;
                }

                const state = JSON.parse(saved);

                this.activeTab = state.activeTab;
                this.tabs = state.tabs;
            } catch (error)
            {
                console.error('Failed to load state:', error);
                this.resetState();
            }
        }
    }
}); 