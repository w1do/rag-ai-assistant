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
| `--radius-one` | `2px` | Минимальный радиус (поля ввода, кнопки, карточки) |
| `--radius-two` | `2px` | Вспомогательные элементы |
| `--radius-three` | `2px` | Основной стиль карточек и блоков (острые углы) |
| `--radius-four` | `2px` | Декоративные фоновые элементы |
| `rounded-full` | `9999px` | Используется исключительно для кругов (иконки, аватары) |

Все закругления в системе ограничены значением **2px** для создания строгого премиального вида. Исключение составляют только полностью круглые элементы.

### Сетка (Grid Background)
Во всех макетах используется фоновая сетка с шагом 30px, реализованная через `linear-gradient` в `body`.
```css
background-image: 
  linear-gradient(rgba(255, 255, 255, 0.02) 1px, transparent 1px),
  linear-gradient(90deg, rgba(255, 255, 255, 0.02) 1px, transparent 1px);
background-size: 30px 30px;
```

### Цвета (Colors)
| Переменная | Значение | Назначение |
|------------|----------|------------|
| `--primary-color` | `#DFFF00` | Акцентный неоново-лаймовый |
| `--background-one` | `#191919` | Фон карточек и блоков |
| `--border-color-one` | `rgba(255,255,255,0.1)` | Основной цвет границ |

## 5. FAQ
Компонент аккордеона для часто задаваемых вопросов 

## 6. Alert
Стильный компонент уведомлений с эффектом стеклянного фона (glassmorphism) и неоновым свечением.

- **Путь**: `resources/js/Components/Alert.tsx`
- **Использование**: Отображение статусов, ошибок и информационных сообщений.
- **Типы**: `success`, `error`, `warning`, `info`.

```tsx
import Alert from '@/Components/Alert';

<Alert type="success" title="Успешно!">
    Ваши настройки были сохранены.
</Alert>
```

## Ввод данных (Forms & Inputs)
Во всей системе используется единый стиль полей ввода.
- **Особенности**: 
    - Минимальный радиус скругления (`2px`).
    - Отключение автоматического заполнения (`autoComplete`) во всех формах для повышения безопасности и предотвращения конфликтов с браузерными подсказками.
    - Анимированные состояния фокуса с использованием `--primary-color`.

---

## 7. AssistantChat
Страница просмотра истории диалогов конкретного ассистента с возможностью генерации саммари через ИИ.

- **Путь**: `resources/js/Pages/Chat/AssistantChat.tsx`
- **Использование**: Для административного просмотра взаимодействия пользователей с ботом.
- **Особенности**:
    - Список сообщений с разделением на User и Bot.
    - Интеграция с AI для анализа последних вопросов.
    - Тёмная тема с использованием `--extra-color` и `--primary-color`.

## 8. GradientAlert
Премиальный алерт с анимированным градиентным бордером и призывом к действию.

- **Путь**: `resources/js/Components/GradientAlert.tsx`
- **Использование**: Главные страницы личного кабинета, важные объявления.
- **Особенности**:
    - Анимированный бордер (`shimmer`) с переливом слева направо.
    - Градиент от лаймового к белому.
    - Кнопка с эффектом масштабирования при наведении.

```tsx
import GradientAlert from '@/Components/GradientAlert';

<GradientAlert />
```
