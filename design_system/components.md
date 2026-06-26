### A. Базовые принципы

| Принцип | Описание |
|---------|----------|
| **Single Responsibility** | Один компонент — одна задача |
| **Reusability** | Компоненты должны быть переиспользуемыми |
| **Composability** | Сложные компоненты собираются из простых |
| **Consistency** | Одинаковые компоненты выглядят одинаково везде |

---

### B. Структура компонента

#### Обязательная структура папки:

ComponentName/
├── index.tsx # основной экспорт
├── ComponentName.tsx # логика компонента
├── types.ts # TypeScript интерфейсы

---

```typescript
interface ButtonProps {
    /** Основной текст кнопки */
    label: string;
    /** Вариант стиля */
    variant?: 'primary' | 'secondary' | 'outline';
    /** Состояние загрузки */
    isLoading?: boolean;
    /** Отключена ли кнопка */
    isDisabled?: boolean;
    /** Обработчик клика */
    onClick?: () => void;
    /** Размер кнопки */
    size?: 'small' | 'medium' | 'large';
}
```
---
```tsx
/**
 * Кнопка с поддержкой различных вариантов и состояний
 * 
 * @example
 * <Button variant="primary" isLoading={false}>
 *   Нажми меня
 * </Button>
 */
export const Button: React.FC<ButtonProps> = ({ ... }) => {
  // ...
};
```

```tsx
// index.ts (главный файл библиотеки)
export { Button } from './Button';
export { Card } from './Card';
export { Input } from './Input';
// ... и так далее
```
