import React from 'react';
import { View } from 'react-native';
import EmployeeCard from './EmployeeCard';
import { Employee } from '../types';

export default {
  title: 'Components/EmployeeCard',
  component: EmployeeCard,
  decorators: [
    (Story: React.ComponentType) => (
      <View style={{ padding: 16, backgroundColor: '#f5f5f5' }}>
        <Story />
      </View>
    ),
  ],
};

const mockEmployee: Employee = {
  id: '1',
  name: 'Doe',
  firstName: 'John',
  phoneNumber: '+1234567890',
  photo: 'https://example.com/photo.jpg',
  companyInitials: 'AC',
  qrCodeUrl: 'https://example.com/qr.png',
  uniqueId: 'EMP001',
};

export const Default = {
  args: {
    employee: mockEmployee,
    onPress: () => console.log('Card pressed'),
    onLongPress: () => console.log('Card long pressed'),
  },
};

export const WithoutPhoto = {
  args: {
    employee: {
      ...mockEmployee,
      photo: undefined,
    },
    onPress: () => console.log('Card pressed'),
    onLongPress: () => console.log('Card long pressed'),
  },
};

export const CustomStyle = {
  args: {
    employee: mockEmployee,
    onPress: () => console.log('Card pressed'),
    onLongPress: () => console.log('Card long pressed'),
    style: {
      backgroundColor: '#e3f2fd',
      borderRadius: 12,
    },
  },
};
