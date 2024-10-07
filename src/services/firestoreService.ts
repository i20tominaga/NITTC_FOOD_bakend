import { db } from '../config/firebaseConfig';
import { User, InventoryItem, Order, Notification } from '../types';
import { CollectionReference, DocumentReference, DocumentSnapshot, SetOptions, UpdateData } from 'firebase-admin/firestore';

// Usersコレクションの操作
export async function createUser(user: User) {
    const userRef: DocumentReference = db.collection('Users').doc(user.userId);
    await userRef.set(user);
}

export async function getUser(userId: string): Promise<User | null> {
    const userRef: DocumentReference = db.collection('Users').doc(userId);
    const userSnap: DocumentSnapshot = await userRef.get();
    return userSnap.exists ? (userSnap.data() as User) : null;
}

export async function updateUser(user: User) {
    const userRef: DocumentReference = db.collection('Users').doc(user.userId);

    // User オブジェクトからプロパティを取得し、適切な形式に変換
    const userData: { [key: string]: any } = {
        userId: user.userId,
        email: user.email,
        name: user.name,
        role: user.role,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
    };

    await userRef.update(userData);
}

export async function deleteUser(userId: string) {
    const userRef: DocumentReference = db.collection('Users').doc(userId);
    await userRef.delete();
}

// Inventoryコレクションの操作
export async function createInventoryItem(item: InventoryItem) {
    const itemRef: DocumentReference = db.collection('Inventory').doc(item.itemId);
    await itemRef.set(item);
}

export async function getInventoryItem(itemId: string): Promise<InventoryItem | null> {
    const itemRef: DocumentReference = db.collection('Inventory').doc(itemId);
    const itemSnap: DocumentSnapshot = await itemRef.get();
    return itemSnap.exists ? (itemSnap.data() as InventoryItem) : null;
}

export async function updateInventoryItem(item: InventoryItem) {
    const itemRef: DocumentReference = db.collection('Inventory').doc(item.itemId);

    // InventoryItem オブジェクトからプロパティを取得し、適切な形式に変換
    const itemData: { [key: string]: any } = {
        itemId: item.itemId,
        itemName: item.itemName,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        updatedAt: item.updatedAt
    };

    await itemRef.update(itemData);
}

export async function deleteInventoryItem(itemId: string) {
    const itemRef: DocumentReference = db.collection('Inventory').doc(itemId);
    await itemRef.delete();
}

// Ordersコレクションの操作
export async function createOrder(order: Order) {
    const orderRef: DocumentReference = db.collection('Orders').doc(order.orderId);
    await orderRef.set(order);
}

export async function getOrder(orderId: string): Promise<Order | null> {
    const orderRef: DocumentReference = db.collection('Orders').doc(orderId);
    const orderSnap: DocumentSnapshot = await orderRef.get();
    return orderSnap.exists ? (orderSnap.data() as Order) : null;
}

export async function updateOrder(order: Order) {
    const orderRef: DocumentReference = db.collection('Orders').doc(order.orderId);

    // Order オブジェクトからプロパティを取得し、適切な形式に変換
    const orderData: { [key: string]: any } = {
        orderId: order.orderId,
        userId: order.userId,
        ticketNumber: order.ticketNumber, // ticketIdをticketNumberに変更
        items: order.items,
        totalPrice: order.totalPrice,
        status: order.status,
        createdAt: order.createdAt,
        updatedAt: order.updatedAt
    };

    await orderRef.update(orderData);
}

export async function deleteOrder(orderId: string) {
    const orderRef: DocumentReference = db.collection('Orders').doc(orderId);
    await orderRef.delete();
}

// Notificationsコレクションの操作
export async function createNotification(notification: Notification) {
    const notificationRef: DocumentReference = db.collection('Notifications').doc(notification.notificationId);
    await notificationRef.set(notification);
}

export async function getNotification(notificationId: string): Promise<Notification | null> {
    const notificationRef: DocumentReference = db.collection('Notifications').doc(notificationId);
    const notificationSnap: DocumentSnapshot = await notificationRef.get();
    return notificationSnap.exists ? (notificationSnap.data() as Notification) : null;
}

export async function updateNotification(notification: Notification) {
    const notificationRef: DocumentReference = db.collection('Notifications').doc(notification.notificationId);

    // Notification オブジェクトからプロパティを取得し、適切な形式に変換
    const notificationData: { [key: string]: any } = {
        notificationId: notification.notificationId,
        userId: notification.userId,
        message: notification.message,
        sentAt: notification.sentAt,
        read: notification.read
    };

    await notificationRef.update(notificationData);
}

export async function deleteNotification(notificationId: string) {
    const notificationRef: DocumentReference = db.collection('Notifications').doc(notificationId);
    await notificationRef.delete();
}
