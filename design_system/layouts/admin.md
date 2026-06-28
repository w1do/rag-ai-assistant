# Admin Panel Layout Design — Agent Control Center (AI & RAG)

## Overview
Панель управления NeuralFlow — это интерфейс для мониторинга и обучения искусственного интеллекта. Она сочетает в себе научную строгость с индустриальной надежностью, предоставляя интуитивный контроль над сложными RAG-процессами.

## Layout Structure

### 1. Agent Hub Dashboard
- **Sidebar:** Фиксированная панель "Neural Navigation". Использование `Dark Surface Glass`. Пункты меню: "Agents", "Knowledge Vault", "Prompt Lab", "Analytics".
- **Top Header:** "Real-time AI Health" — панель с глобальными метриками: средняя точность ответов (Accuracy), задержка (Latency), количество активных токенов.
- **Main Content Area:** Сетка виджетов с состоянием каждого бота.

### 2. The Knowledge Vault (Vector Management)
- **Concept:** Управление данными не в виде скучных таблиц, а как "Библиотека Будущего".
- **Visuals:** 
    - Основной блок содержит 3D-представление векторного пространства (точки-данные).
    - **Nested Blocks:** Вложенные карточки "Data Sources" с индикаторами статуса индексации.
    - При клике на источник данных открывается вложенный список фрагментов (chunks) с их векторными весами.
- **Interactivity:** Возможность перетаскивания (drag-and-drop) новых документов прямо в "Ядро векторизации".

### 3. Prompt Engineering & Testing Lab
- **Layout:** Разделенный экран (Split screen).
    - Лево: Редактор промпта с подсветкой синтаксиса и переменными.
    - Право: Окно "Thinking Trace" (след размышлений бота).
- **Thinking Trace (Nested Blocks):** 
    - Блок 1: "Retrieved Context" (какие куски данных были найдены в RAG).
    - Блок 2: "Internal Reasoning" (как бот интерпретировал данные).
    - Блок 3: "Final Response".
- **Visuals:** Эффект глассморфизма для блоков выдачи ответа, чтобы подчеркнуть "цифровую природу" текста.

### 4. Training & Fine-tuning Interface
- **Concept:** Визуальное представление процесса "обучения" бота.
- **Design:** Прогресс-бары в виде "нейронных путей", которые заполняются по мере обработки тренировочных данных.
- **Buttons:** Анимированные кнопки "Start Training" с эффектом `soft-pulse` во время процесса.

## Color Palette for Admin
- **Neutral:** `#0C1019` (Background), `#151B27` (Widgets).
- **AI Accents:** 
    - Neural Gold: `#C8A645` (Intelligence).
    - Logic Blue: `#4A90E2` (Processing).
    - Error Red: `#D93025` (Hallucination/Error).
- **Typography:** `DM Sans` для всех данных. `DM Serif Display` только для названий ассистентов в их профилях.

## Animations & UX
- **Data Wave:** Тонкая анимированная волна в нижней части виджетов, показывающая текущую нагрузку на API.
- **Mechanical Counter:** Значения токенов и стоимости меняются с эффектом перелистывания цифр.
- **Skeleton Pulse:** Пульсация скелетонов при подгрузке длинных цепочек рассуждений (Chain of Thought).

## Responsive Behavior
- Dashboard автоматически группирует виджеты в зависимости от критичности: алармы (ошибки ботов) всегда сверху.
- На планшетах "Prompt Lab" переходит в режим вкладок вместо разделенного экрана.
