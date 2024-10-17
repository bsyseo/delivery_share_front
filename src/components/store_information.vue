<template>
    <div class="dashboard-container">
        <div class="sidebar">
            <ul class="no-bullets">
                <li>
                    <button class="sidebar-button" @click="$router.push('/business_menu')">
                        가게 정보 & 메뉴
                    </button>
                </li>
                <li>
                    <button @click="showUnderConstruction" class="sidebar-button">
                        상품 관리
                    </button>
                </li>
                <li>
                    <button @click="showUnderConstruction" class="sidebar-button">
                        판매 관리
                    </button>
                </li>
                <li>
                    <button @click="showUnderConstruction" class="sidebar-button">
                        정산 관리
                    </button>
                </li>
                <li>
                    <button @click="showUnderConstruction" class="sidebar-button">
                        문의 / 상담
                    </button>
                </li>
                <li>
                    <button class="sidebar-button" @click="navigateTo('order_status')">
                        주문 현황
                    </button>
                </li>
                <li>
                    <button class="sidebar-button" @click="$router.push('/')">
                        Home
                    </button>
                </li>
            </ul>
        </div>
        <div class="content">
            <div class="store-info">
                <h2>가게 정보 관리</h2>
                <div class="info-section">
                    <div class="info-box">
                        <label for="storeName">스토어 이름 등록 / 변경</label>
                        <div class="input-with-button">
                            <input
                                type="text"
                                id="storeName"
                                v-model="storeName"
                                :disabled="storeNameRegistered && !editingStoreName"
                                placeholder="가게 이름을 입력하세요"
                            />
                            <div v-if="!storeNameRegistered">
                                <button @click="registerStoreName">등록</button>
                            </div>
                            <div v-else>
                                <button v-if="!editingStoreName" @click="enableStoreNameEditing">변경하기</button>
                                <button v-if="editingStoreName" @click="saveStoreName">저장</button>
                            </div>
                        </div>
                    </div>
                    <div class="info-box centered">
                        <label>영업 시간</label>
                        <div class="time-inputs centered">
                            <input 
                                type="text" 
                                v-model="formattedOpenTime" 
                                placeholder="오픈 시간 (예: 09:00 AM)" 
                                @input="updateOpenTime" 
                            />
                            <input 
                                type="text" 
                                v-model="formattedCloseTime" 
                                placeholder="마감 시간 (예: 09:00 PM)" 
                                @input="updateCloseTime" 
                            />
                        </div>
                    </div>
                    <div class="info-box centered">
                        <label>휴무일 설정</label>
                        <div class="day-selection centered">
                            <label v-for="day in days" :key="day">
                                <input type="checkbox" v-model="dayoff" :value="day" />
                                {{ day }}
                            </label>
                        </div>
                        <div class="calendar-selection">
                            <label>날짜 선택</label>
                            <input type="date" v-model="selectedCloseDay" @change="addCloseDay" />
                        </div>
                        <p class="selected-days">선택된 휴무일: {{ dayoff.join(', ') }} / {{ closeDays.join(', ') }}</p>
                    </div>
                </div>
            </div>
            <div class="actions">
                <button class="action-button save-button" @click="saveStoreInfo">가게 정보 저장</button>
            </div>
        </div>
    </div>

    <div class="dashboard-container2">
        <h2>현재 들어온 주문</h2>
        <div v-if="orders.length === 0" class="no-orders">
            <p>들어온 주문이 없습니다.</p>
        </div>
        <div v-for="order in orders" :key="order.id" class="order-box">
            <p><strong>메뉴:</strong> {{ order.menuName }}</p>
            <p><strong>수량:</strong> {{ order.quantity }}</p>
            <p><strong>예약 시간:</strong> {{ order.reservationTime }}</p>
            <button @click="acceptOrder(order.id)" class="accept-button">주문 받기</button>
            <button @click="rejectOrder(order.id)" class="reject-button">거절하기</button>
        </div>
    </div>
</template>

<script>
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { ref, set, get, onValue } from 'firebase/database';
import { database } from '@/firebase';
import moment from 'moment-timezone';

export default {
    name: 'BusinessComponent',
    data() {
        return {
            storeName: '',
            storeNameRegistered: false,
            editingStoreName: false,
            openTime: '',
            closeTime: '',
            dayoff: [],
            closeDays: [],
            selectedCloseDay: '',
            days: ['월요일', '화요일', '수요일', '목요일', '금요일', '토요일', '일요일'],
            orders: [],
        };
    },
    computed: {
        formattedOpenTime: {
            get() {
                return this.openTime ? moment(this.openTime, 'HH:mm').format('hh:mm A') : '';
            },
            set(value) {
                this.openTime = moment(value, 'hh:mm A').format('HH:mm');
            }
        },
        formattedCloseTime: {
            get() {
                return this.closeTime ? moment(this.closeTime, 'HH:mm').format('hh:mm A') : '';
            },
            set(value) {
                this.closeTime = moment(value, 'hh:mm A').format('HH:mm');
            }
        }
    },
    mounted() {
        this.fetchOrders();
        this.fetchBusinessInfo();
    },
    methods: {
        registerStoreName() {
            if (this.storeName) {
                const auth = getAuth();
                onAuthStateChanged(auth, (user) => {
                    if (user) {
                        const storeNameRef = ref(database, `store/${user.uid}/storeName`);
                        set(storeNameRef, this.storeName)
                            .then(() => {
                                this.storeNameRegistered = true;
                                alert('가게 이름이 등록되었습니다.');
                            })
                            .catch((error) => {
                                console.error('가게 이름 등록 실패:', error);
                            });
                    }
                });
            } else {
                alert('가게 이름을 입력하세요.');
            }
        },
        enableStoreNameEditing() {
            this.editingStoreName = true;
        },
        saveStoreName() {
            if (this.storeName) {
                const auth = getAuth();
                onAuthStateChanged(auth, (user) => {
                    if (user) {
                        const storeNameRef = ref(database, `store/${user.uid}/storeName`);
                        set(storeNameRef, this.storeName)
                            .then(() => {
                                this.editingStoreName = false;
                                alert('가게 이름이 변경되었습니다.');
                            })
                            .catch((error) => {
                                console.error('가게 이름 변경 실패:', error);
                            });
                    }
                });
            } else {
                alert('가게 이름을 입력하세요.');
            }
        },
        addCloseDay() {
            if (this.selectedCloseDay && !this.closeDays.includes(this.selectedCloseDay)) {
                this.closeDays.push(this.selectedCloseDay);
            }
        },
        async saveStoreInfo() {
            const auth = getAuth();
            onAuthStateChanged(auth, async (user) => {
                if (user) {
                    const storeInfoRef = ref(database, `store/${user.uid}`);
                    const existingDataSnapshot = await get(storeInfoRef);
                    const existingData = existingDataSnapshot.exists() ? existingDataSnapshot.val() : {};

                    const newData = {
                        storeName: this.storeName,
                        operationHours: {
                            open: this.openTime,
                            close: this.closeTime,
                        },
                        dayoff: this.dayoff,
                        closeDays: this.closeDays,
                    };

                    // 기존 데이터와 병합하여 저장
                    await set(storeInfoRef, { ...existingData, ...newData });
                    alert('가게 정보가 저장되었습니다.');
                }
            });
        },
        fetchBusinessInfo() {
            const auth = getAuth();
            onAuthStateChanged(auth, (user) => {
                if (user) {
                    const businessInfoRef = ref(database, `store/${user.uid}`);
                    get(businessInfoRef).then((snapshot) => {
                        if (snapshot.exists()) {
                            const data = snapshot.val();
                            this.storeName = data.storeName || '';
                            this.openTime = data.operationHours.open || '';
                            this.closeTime = data.operationHours.close || '';
                            this.dayoff = data.dayoff || [];
                            this.closeDays = data.closeDays || [];
                        }
                    });
                }
            });
        },
        fetchOrders() {
            const auth = getAuth();
            onAuthStateChanged(auth, (user) => {
                if (user) {
                    const ordersRef = ref(database, `store/${user.uid}/orders`);
                    onValue(ordersRef, (snapshot) => {
                        const data = snapshot.val();
                        if (data) {
                            this.orders = Object.keys(data).map(key => ({
                                id: key,
                                ...data[key],
                            }));
                        } else {
                            this.orders = [];
                        }
                    });
                }
            });
        },
        acceptOrder(orderId) {
            alert(`주문 ${orderId}을(를) 받았습니다.`);
            this.updateOrderStatus(orderId, 'accepted');
        },
        rejectOrder(orderId) {
            alert(`주문 ${orderId}을(를) 거절했습니다.`);
            this.updateOrderStatus(orderId, 'rejected');
        },
        updateOrderStatus(orderId, status) {
            const auth = getAuth();
            onAuthStateChanged(auth, (user) => {
                if (user) {
                    const orderStatusRef = ref(database, `store/${user.uid}/orders/${orderId}/status`);
                    set(orderStatusRef, status);
                }
            });
        },
        navigateTo(routeName) {
            this.$router.push({ name: routeName });
        },
        showUnderConstruction() {
            alert('준비중입니다.');
        }
    },
};
</script>

<style scoped>
/* 기존 스타일 유지 */
.dashboard-container {
    display: flex;
    justify-content: center;
    align-items: flex-start;
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px;
    background-color: #f9f9f9;
    border-radius: 20px;
    box-shadow: 
        0px 3.53px 3.53px 0px rgba(0, 0, 0, 0.25),
        inset 0px 3.53px 3.53px 0px rgba(0, 0, 0, 0.25);
}

.sidebar {
    margin-top: 4vh;
    width: 250px;
    background-color: #BFDC99;
    padding: 20px;
    border-radius: 12px;
    color: black;
    margin-right: 100px;
    margin-left: -150px;
}

.sidebar-button {
    background-color: #EFFAD6;
    border: none;
    padding: 10px;
    text-align: left;
    font-size: 16px;
    font-weight: bold;
    color: #000;
    cursor: pointer;
    width: 80%;
    margin-top: 2vh;
}

.sidebar-button:hover {
    background-color: #D5F2C1;
}

h2 {
    font-size: 24px;
    color: #333;
    font-weight: bold;
    margin-bottom: 20px;
    text-align: center;
}

.info-section {
    margin-bottom: 30px;
}

.info-box {
    display: flex;
    flex-direction: column;
    gap: 8px;
    align-items: center;
}

.input-with-button {
    display: flex;
    align-items: center;
    gap: 10px;
}

input[type="text"], input[type="time"], input[type="date"] {
    padding: 10px;
    border: 1px solid #ddd;
    border-radius: 8px;
    font-size: 14px;
    transition: all 0.3s;
}

input[type="text"]:focus, input[type="time"]:focus, input[type="date"]:focus {
    border-color: #4CAF50;
}

.time-inputs {
    display: flex;
    gap: 10px;
    justify-content: center;
}

.day-selection {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    justify-content: center;
}

.calendar-selection label {
    margin-right: 10px;
}

.calendar-selection {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-top: 15px;
}

.selected-days {
    font-size: 14px;
    color: #555;
}

.actions {
    display: flex;
    justify-content: center;
    gap: 10px;
    margin-top: 20px;
}

.action-button {
    padding: 10px 18px;
    background-color: #EFFAD6;
    color: gray;
    border: none;
    border-radius: 8px;
    font-size: 14px;
    cursor: pointer;
    transition: background-color 0.3s;
}

.action-button:hover {
    background-color: #D5F2C1;
}

button {
    padding: 12px 24px;
    background-color: #EFFAD6;
    color: gray;
    border: none;
    border-radius: 8px;
    font-size: 16px;
    font-weight: bold;
    cursor: pointer;
    transition: background-color 0.3s, box-shadow 0.3s;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

button:hover {
    background-color: #45a049;
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
}

button:active {
    background-color: #3e8e41;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.order-box {
    border: 1px solid #ddd;
    padding: 10px;
    border-radius: 8px;
    margin-bottom: 10px;
}

.no-orders {
    text-align: center;
    color: gray;
    font-size: 16px;
}

.accept-button {
    background-color: #4CAF50;
    color: white;
    border: none;
    padding: 8px;
    border-radius: 4px;
    cursor: pointer;
}

.reject-button {
    background-color: #FF6347;
    color: white;
    border: none;
    padding: 8px;
    border-radius: 4px;
    cursor: pointer;
    margin-left: 10px;
}

.no-bullets {
    list-style-type: none;
    padding: 0;
    margin: 0;
}

@font-face {
    font-family: 'NanumSquareRound';
    src: url('@/assets/font/NANUMSQUAREROUNDOTFB.OTF') format('opentype');
}

* {
    font-family: 'NanumSquareRound', sans-serif;
}
</style>
