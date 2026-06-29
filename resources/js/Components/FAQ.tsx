import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface FAQItem {
    question: string;
    answer: string;
}

interface FAQProps {
    items?: FAQItem[];
    title?: React.ReactNode;
    subtitle?: string;
}

/**
 * Компонент секции FAQ для лендинга.
 * 
 * Отображает список часто задаваемых вопросов в виде аккордеона.
 * Включает информацию по AI RAG, мониторингу конкурентов, обучению и интеграции.
 */
export default function FAQ({ items, title, subtitle }: FAQProps) {
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    const defaultFaqs: FAQItem[] = [
        {
            question: "Что такое AI RAG чат-бот и чем он отличается от обычных ботов?",
            answer: "RAG (Retrieval-Augmented Generation) — это продвинутая технология, которая позволяет ИИ использовать вашу уникальную базу знаний для ответов. В отличие от обычных ботов, наш ассистент не \"галюцинирует\", а оперирует только вашими документами и данными, обеспечивая максимальную точность и актуальность информации."
        },
        {
            question: "Как работает система мониторинга конкурентов по ключевым фразам?",
            answer: "Вы просто добавляете список ключевых слов и фраз, которые важны для вашего бизнеса. Система автоматически отслеживает изменения на сайтах конкурентов и в открытых источниках по этим запросам, уведомляя вас о новых предложениях, изменениях цен или маркетинговых активностях конкурентов."
        },
        {
            question: "Для каких платформ доступны ваши автоматические боты?",
            answer: "Наши боты универсальны. Вы можете использовать автоматических ботов для сайтов (в виде виджета) и для системы MAX (интеграция с мессенджерами и внешними платформами), обеспечивая присутствие вашего ассистента там, где находятся ваши клиенты."
        },
        {
            question: "Насколько сложно встроить готового ассистента на мой сайт?",
            answer: "Мы реализовали встраивание в один клик. После настройки ассистента вы получаете короткий код, который нужно добавить на ваш сайт. Никаких сложных интеграций или услуг программистов не требуется — ассистент появится на сайте мгновенно."
        },
        {
            question: "Могу ли я использовать собственные заготовленные вопросы для обучения?",
            answer: "Безусловно. Вы можете загрузить список часто задаваемых вопросов (FAQ) вашего бизнеса. Это позволит системе быстрее понять специфику вашей работы и гарантировать, что на стандартные вопросы клиенты всегда получат проверенные и точные ответы."
        },
        {
            question: "Как происходит обучение системы голосовым вводом?",
            answer: "Это одна из наших уникальных функций. Вместо того чтобы писать длинные тексты, вы можете просто продиктовать информацию о вашем продукте или услуге. Система автоматически распознает голос, превратит его в текст и добавит в базу знаний ассистента."
        },
        {
            question: "Какие типы документов можно загружать для обучения ИИ?",
            answer: "Система поддерживает все основные форматы документов: PDF, Microsoft Word, Excel и текстовые файлы. Просто перетащите файлы в панель управления, и через несколько минут ваш бот будет знать всё содержимое этих документов."
        },
        {
            question: "Как бот обучается на сайтах конкурентов и ссылках?",
            answer: "Вы можете предоставить ссылки на сайты ваших конкурентов или тематические ресурсы. Наша система просканирует указанные страницы, извлечет полезную информацию и обучит вашего ассистента, чтобы он мог аргументированно отвечать на вопросы, сравнивая ваши преимущества с предложениями конкурентов."
        },
        {
            question: "Могу ли я изменять настройки ассистента после его запуска?",
            answer: "Да, вы имеете полный контроль над ассистентом в реальном времени. Вы можете в любой момент догрузить новые документы, изменить ключевые фразы для мониторинга или обновить заготовленные вопросы. Все изменения вступают в силу мгновенно."
        },
        {
            question: "Нужно ли мне постоянно следить за работой бота?",
            answer: "Система работает полностью автоматически. Встроенный мониторинг следит за качеством ответов и активностью конкурентов. Вы будете получать сводные отчеты, что позволит вам сосредоточиться на бизнесе, в то время как ИИ берет на себя рутину общения и анализа."
        }
    ];

    const faqs = items || defaultFaqs;

    const toggle = (index: number) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <section id="faq" className="py-24 bg-body-color">
            <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-title text-white-color sm:text-5xl">
                        {title || <>Operational <span className="text-primary-color">Intelligence</span> FAQ</>}
                    </h2>
                    {subtitle && (
                        <p className="mt-4 text-lg text-text-secondary-dark">
                            {subtitle}
                        </p>
                    )}
                </div>
                
                <div className="space-y-6">
                    {faqs.map((faq, index) => (
                        <div 
                            key={index}
                            className="pricing-item overflow-hidden transition-all duration-500 animate-in fade-in slide-in-from-bottom-4"
                            style={{ animationDelay: `${index * 100}ms`, animationFillMode: 'both' }}
                        >
                            <button
                                onClick={() => toggle(index)}
                                className="w-full flex items-center justify-between p-7 text-left bg-transparent hover:bg-white/5 transition-colors focus:outline-none"
                            >
                                <span className="text-lg font-title text-white-color pr-8 font-normal">
                                    {faq.question}
                                </span>
                                <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-border-color-one transition-all duration-300 ${openIndex === index ? 'bg-primary-color text-black-color border-primary-color' : 'text-text-secondary-dark'}`}>
                                    {openIndex === index ? (
                                        <ChevronUp className="h-5 w-5" />
                                    ) : (
                                        <ChevronDown className="h-5 w-5" />
                                    )}
                                </div>
                            </button>
                            
                            <div 
                                className={`px-7 overflow-hidden transition-all duration-500 ease-in-out ${
                                    openIndex === index ? 'max-h-[500px] pb-7 opacity-100' : 'max-h-0 opacity-0'
                                }`}
                            >
                                <div className="h-px w-full bg-border-color-one mb-6"></div>
                                <p className="text-text-secondary-dark leading-relaxed text-lg">
                                    {faq.answer}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
