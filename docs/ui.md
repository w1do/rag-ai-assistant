# UI Компоненты Системы

В этом документе перечислены основные UI-компоненты, используемые в личном кабинете, их назначение и примеры использования.

## 1. SectionHeader
Компонент для визуального разделения секций на страницах. Содержит заголовок, иконку и декоративную анимированную линию.

- **Путь**: `resources/js/Components/UI/SectionHeader.tsx`
- **Использование**: В начале крупных функциональных блоков.
- **Пропсы**:
    - `title`: Заголовок (string)
    - `icon`: LucideIcon
    - `href`: Ссылка для действия справа (optional)
    - `linkText`: Текст ссылки (optional)
    - `linkIcon`: Иконка ссылки (optional)

```tsx
import SectionHeader from '@/Components/UI/SectionHeader';
import { Sparkles, Plus } from 'lucide-react';

<SectionHeader 
    title="Ассистенты" 
    icon={Sparkles}
    href={route('assistants.create')}
    linkText="Добавить нового"
    linkIcon={Plus}
/>
```

## 2. StatCard
Карточка статистики с градиентным фоном, иконкой и анимацией при наведении.

- **Путь**: `resources/js/Components/Dashboard/StatCard.tsx`
- **Использование**: На дашборде и страницах аналитики.
- **Особенности**: Анимированный бордер (`shimmer`), эффект увеличения иконки при наведении.

```tsx
import StatCard from '@/Components/Dashboard/StatCard';
import { MessagesSquare } from 'lucide-react';

<StatCard
    title="Всего диалогов"
    value={128}
    icon={MessagesSquare}
    color="blue"
    href={route('chats.index')}
/>
```

## 3. LimitReachedCard
Уведомление о достижении лимита с призывом к переходу на новый тариф.

- **Путь**: `resources/js/Components/LimitReachedCard.tsx`
- **Использование**: В местах, где пользователю нужно предложить апгрейд тарифа.

```tsx
import LimitReachedCard from '@/Components/LimitReachedCard';

<LimitReachedCard 
    title="Лимит ассистентов исчерпан" 
    description="Ваш текущий тариф позволяет создать не более 3 ассистентов."
/>
```

## 4. Breadcrumbs
Навигационная цепочка ("Хлебные крошки").

- **Путь**: `resources/js/Components/Breadcrumbs.tsx`
- **Использование**: В верхней части каждой страницы для отображения иерархии навигации.

```tsx
import Breadcrumbs from '@/Components/Breadcrumbs';

<Breadcrumbs items={[
    { label: 'Ассистенты', href: route('assistants.index') },
    { label: 'Создание' }
]} />
```

## Глобальные настройки стилей (CSS Variables)
Все основные параметры интерфейса вынесены в переменные в `resources/css/app.css`:

### Радиусы (Border Radius)
| Переменная | Значение | Описание |
|------------|----------|----------|
| `--radius-one` | `5px` | Малые элементы (бейджы, алерты) |
| `--radius-two` | `15px` | Средние блоки, кнопки, инпуты |
| `--radius-three` | `2px` | Строгий стиль карточек (текущий основной) |
| `--radius-four` | `24px` | Большие блоки (премиальный стиль) |

### Цвета (Colors)
| Переменная | Значение | Назначение |
|------------|----------|------------|
| `--primary-color` | `#DFFF00` | Акцентный неоново-лаймовый |
| `--background-one` | `#191919` | Фон карточек и блоков |
| `--border-color-one` | `rgba(255,255,255,0.1)` | Основной цвет границ |

## 5. AssistantChat
Страница просмотра истории диалогов конкретного ассистента с возможностью генерации саммари через ИИ.

- **Путь**: `resources/js/Pages/Chat/AssistantChat.tsx`
- **Использование**: Для административного просмотра взаимодействия пользователей с ботом.
- **Особенности**:
    - Список сообщений с разделением на User и Bot.
    - Интеграция с AI для анализа последних вопросов.
    - Тёмная тема с использованием `--extra-color` и `--primary-color`.
