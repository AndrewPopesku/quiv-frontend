import type { Word } from '../types/vocabulary';

export const MOCK_WORDS: Word[] = [
    {
        id: '1',
        term: 'Sick',
        phonetic: '/sɪk/',
        mastery: 85,
        definitions: [
            {
                partOfSpeech: 'ADJECTIVE',
                text: 'Unwell or suffering from an illness',
                example: "She's been sick for three days.",
                synonyms: ['ill', 'unwell', 'ailing'],
            },
            {
                partOfSpeech: 'ADJECTIVE',
                isInformal: true,
                text: 'Excellent or impressive; very good',
                example: "That skateboard trick was sick!",
                synonyms: ['awesome', 'amazing', 'cool'],
            },
            {
                partOfSpeech: 'ADJECTIVE',
                text: 'Feeling nauseous or queasy',
                example: "The motion of the boat made him feel sick.",
                synonyms: ['nauseous', 'queasy', 'green'],
            }
        ],
        cinemaExamples: [
            {
                title: 'The Social Network',
                timestamp: '0:45:23',
                imageUrl: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=300&h=200&fit=crop'
            },
            {
                title: 'Good Will Hunting',
                timestamp: '1:12:08',
                imageUrl: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=300&h=200&fit=crop'
            }
        ]
    },
    {
        id: '2',
        term: 'Ephemeral',
        phonetic: '/əˈfem(ə)rəl/',
        mastery: 40,
        definitions: [
            {
                partOfSpeech: 'ADJECTIVE',
                text: 'Lasting for a very short time.',
                example: "The ephemeral beauty of cherry blossoms reminds us to appreciate the present moment.",
                synonyms: ['transient', 'fleeting', 'momentary']
            }
        ],
        cinemaExamples: [
            {
                title: 'Lost in Translation',
                timestamp: '0:22:15',
                imageUrl: 'https://images.unsplash.com/photo-1594909122845-11baa439b7bf?w=300&h=200&fit=crop'
            }
        ]
    },
    {
        id: '3',
        term: 'Serendipity',
        phonetic: '/ˌserənˈdɪpədē/',
        mastery: 10,
        definitions: [
            {
                partOfSpeech: 'NOUN',
                text: 'The occurrence of events by chance in a happy or beneficial way.',
                example: "It was pure serendipity that we met at the coffee shop right before the rain started.",
                synonyms: ['chance', 'happy accident', 'luck']
            }
        ],
        cinemaExamples: []
    },
    {
        id: '4',
        term: 'Mellifluous',
        phonetic: '/məˈliflo͞oəs/',
        mastery: 0,
        definitions: [
            {
                partOfSpeech: 'ADJECTIVE',
                text: '(of a voice or words) sweet or musical; pleasant to hear.',
                example: "She had a rich, mellifluous voice that captivated the audience.",
                synonyms: ['sweet-sounding', 'dulcet', 'honeyed']
            }
        ],
        cinemaExamples: []
    }
];
