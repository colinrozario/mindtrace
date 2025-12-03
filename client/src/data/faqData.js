import { HelpCircle, Glasses, Shield, Settings, LayoutDashboard, Package, Wrench, Headphones } from 'lucide-react';

export const faqData = [
    {
        id: 'general',
        title: 'General',
        icon: HelpCircle,
        questions: [
            {
                q: "What are these smart glasses?",
                a: "Our smart glasses are AI-powered assistive devices designed for individuals with dementia, Alzheimer's, and memory-related conditions. They use face recognition to identify people in real-time and display helpful information like names and relationships—helping users maintain meaningful connections."
            },
            {
                q: "Who are the glasses designed for?",
                a: "The glasses are designed for individuals with early to mid-stage dementia, Alzheimer's disease, mild cognitive impairment (MCI), and other memory disorders. They're also invaluable for caregivers and family members supporting their loved ones' independence."
            },
            {
                q: "How does face recognition work?",
                a: "The glasses' camera captures faces and compares them against photos in your personal contact database. Within seconds, if there's a match, the person's name and information appears on a small display. Think of it like a helpful assistant quietly reminding you who someone is."
            },
            {
                q: "Do the glasses work indoors and outdoors?",
                a: "Yes! The adaptive camera adjusts for different lighting—from bright sunlight to indoor environments. For optimal performance, well-lit spaces work best, as very dark environments may reduce accuracy."
            }
        ]
    },
    {
        id: 'usage',
        title: 'Usage',
        icon: Glasses,
        questions: [
            {
                q: "How do the glasses identify people?",
                a: "The glasses use AI to match real-time camera images with photos saved in your contact database. Caregivers upload photos through the dashboard, and when the glasses detect a matching face, they display results instantly."
            },
            {
                q: "What information appears when someone is recognized?",
                a: "You'll see the person's name and relationship (e.g., \"Sarah - Your Daughter\"), along with optional details like recent conversation topics, helpful notes, and when you last saw them."
            },
            {
                q: "What happens if someone isn't recognized?",
                a: "The glasses display \"New Person\" and notify the caregiver dashboard with an optional photo, allowing caregivers to add this person if appropriate. This prevents confusion while keeping the system learning."
            },
            {
                q: "Can caregivers update the contact list?",
                a: "Yes. Caregivers have full control through the dashboard—add new contacts, update information, add helpful notes, or remove people. Changes sync automatically when connected to WiFi."
            },
            {
                q: "Do users need to press any buttons?",
                a: "The glasses are hands-free. Face recognition happens automatically, and optional voice commands provide additional context. Physical buttons are only needed for power and charging."
            }
        ]
    },
    {
        id: 'privacy',
        title: 'Privacy & Security',
        icon: Shield,
        questions: [
            {
                q: "Is my data stored securely?",
                a: "Yes. All data is encrypted using bank-level AES-256 encryption, both in transit and at rest. Photos are stored in HIPAA-compliant infrastructure with strict access controls."
            },
            {
                q: "Does the device record audio continuously?",
                a: "No. The glasses do NOT continuously record audio. Conversation summarization processes speech locally in real-time, extracts key topics, then discards raw audio. Only brief summaries are saved—never full recordings."
            },
            {
                q: "Who can access the data?",
                a: "Only the primary user and authorized caregivers/family members. Each caregiver has their own login with customizable permissions. We cannot access your data without explicit consent and never sell to third parties."
            },
            {
                q: "Can data be deleted?",
                a: "Yes. Remove individual contacts anytime through the dashboard, or request complete data deletion to permanently remove all information from our servers within 30 days."
            }
        ]
    },
    {
        id: 'technical',
        title: 'Technical',
        icon: Settings,
        questions: [
            {
                q: "How long does the battery last?",
                a: "8-12 hours with typical use—enough for a full day. The charging case provides 2 additional full charges. A 30-minute quick charge gives approximately 3 hours of use."
            },
            {
                q: "Do the glasses need Wi-Fi?",
                a: "Core face recognition works offline using locally stored data. WiFi is needed for syncing new contacts, software updates, and uploading conversation summaries. We recommend connecting daily."
            },
            {
                q: "Are the glasses comfortable?",
                a: "Yes! Weighing only 45 grams (similar to regular glasses), they feature adjustable nose pads and flexible temples for all-day comfort. Users often forget they're wearing them."
            },
            {
                q: "How accurate is the recognition?",
                a: "95-98% accuracy under normal conditions with properly uploaded photos. Accuracy improves as more photos are added and caregivers provide feedback on identifications."
            }
        ]
    },
    {
        id: 'dashboard',
        title: 'Dashboard',
        icon: LayoutDashboard,
        questions: [
            {
                q: "What can I see on the dashboard?",
                a: "View recent recognitions, conversation summaries, device status, upcoming reminders, alerts for unrecognized people, and analytics on social engagement patterns over time."
            },
            {
                q: "Can caregivers correct misidentifications?",
                a: "Yes, and it's encouraged! Corrections help train the AI for better accuracy. Simply select the incorrect recognition, choose the right person, and the system learns from this feedback."
            },
            {
                q: "Can I set reminders?",
                a: "Absolutely. Schedule reminders for medications, appointments, meals, and custom events. Reminders appear as gentle visual notifications with optional audio cues."
            }
        ]
    },
    {
        id: 'setup',
        title: 'Setup',
        icon: Package,
        questions: [
            {
                q: "How do I set up the glasses?",
                a: "Setup takes about 15 minutes: download the app, create an account, charge the glasses, pair via Bluetooth, upload photos of key contacts, and customize preferences. Our wizard guides each step."
            },
            {
                q: "How do I add new contacts?",
                a: "In the dashboard, go to Contacts → Add New Person. Enter their name, relationship, upload 3-5 clear photos, and add optional notes. Changes sync to glasses within minutes."
            },
            {
                q: "What if the glasses freeze?",
                a: "Hold the power button for 10 seconds to restart. If issues persist, place glasses in the charging case for 30 seconds for a deeper reset. Contact support if problems continue."
            }
        ]
    },
    {
        id: 'troubleshooting',
        title: 'Troubleshooting',
        icon: Wrench,
        questions: [
            {
                q: "Recognition isn't working—what should I do?",
                a: "Try: 1) Move to better lighting, 2) Verify photos are uploaded, 3) Add more recent photos from different angles, 4) Clean the camera lens, 5) Check sync status in the app."
            },
            {
                q: "How do I fix \"low accuracy\" warnings?",
                a: "Update photos with recent images showing different lighting and angles. If someone's appearance changed significantly (new hairstyle, glasses), new photos are essential."
            },
            {
                q: "Dashboard isn't syncing—what should I check?",
                a: "Verify glasses are connected to WiFi and powered on. Try manually triggering a sync from the app. Check your internet connection and restart both glasses and app if needed."
            }
        ]
    },
    {
        id: 'support',
        title: 'Support',
        icon: Headphones,
        questions: [
            {
                q: "Is there a warranty?",
                a: "Yes—2-year limited warranty covering manufacturing defects and hardware issues. Accidental damage protection is available as an add-on. Includes free repairs or replacement."
            },
            {
                q: "How do I contact support?",
                a: "Email us at support@[company].com (24-hour response), use live chat in the app (8AM-8PM EST), call for urgent issues, or schedule a video troubleshooting session."
            },
            {
                q: "What's the return policy?",
                a: "30-day satisfaction guarantee. Return in original condition for full refund. Extended trial periods available for users needing more evaluation time."
            }
        ]
    }
];
