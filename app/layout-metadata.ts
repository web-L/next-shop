// app/layout-metadata.ts
import { Metadata } from 'next';

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://hengtianyi.com'),
  title: {
    template: '%s | 恒天翊',
    default: '恒天翊 - 智能化PCBA一站式服务',
  },
  description: '专注多品种小批量PCBA一站式快捷生产，以速度、品质、技术、服务为核心经营理念的智能化工厂。提供SMT贴片、PCB制作、设备产品等专业服务。',
  keywords: [
    'PCBA',
    'SMT贴片',
    'PCB制作',
    '电子制造',
    '工业设备',
    '回流焊',
    '波峰焊',
    '贴片机',
    'AOI检测',
    '恒天翊',
    'PCBA一站式服务',
    '小批量PCBA',
    '多品种PCBA',
  ],
  authors: [{ name: '恒天翊' }],
  creator: '恒天翊',
  publisher: '恒天翊',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: '恒天翊 - 智能化PCBA一站式服务',
    description: '专注多品种小批量PCBA一站式快捷生产，以速度、品质、技术、服务为核心经营理念的智能化工厂',
    url: process.env.NEXT_PUBLIC_SITE_URL || 'https://hengtianyi.com',
    siteName: '恒天翊',
    locale: 'zh_CN',
    type: 'website',
    images: [
      {
        url: '/logo.svg',
        width: 140,
        height: 28,
        alt: '恒天翊 Logo',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: '恒天翊 - 智能化PCBA一站式服务',
    description: '专注多品种小批量PCBA一站式快捷生产',
    images: ['/logo.svg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    // 可以添加 Google Search Console 和百度站长验证
    // google: 'your-google-verification-code',
    // yandex: 'your-yandex-verification-code',
    // yahoo: 'your-yahoo-verification-code',
  },
  alternates: {
    canonical: process.env.NEXT_PUBLIC_SITE_URL || 'https://hengtianyi.com',
  },
};
