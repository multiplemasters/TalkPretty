import { useEffect, useMemo, useState } from 'react';
import {
  ArrowRight,
  BookOpen,
  Check,
  ChevronRight,
  Copy,
  Heart,
  Moon,
  Search,
  SlidersHorizontal,
  Sparkles,
  Star,
  Sun,
  X,
} from 'lucide-react';

type Theme = 'light' | 'dark';
type Step = { letter: string; label: string; description: string };
type Framework = {
  id: string;
  acronym: string;
  name: string;
  categories: string[];
  tagline: string;
  description: string;
  steps: Step[];
  howToUse: string;
  example: string;
  bestFor: string[];
  mnemonic: { word: string; cue: string; color: string };
  sourceNote?: string;
};

const categories = [
  'All',
  'Conflict resolution',
  'Feedback & coaching',
  'Job interviews',
  'Executive updates',
  'Storytelling',
  'Strategy',
  'Persuasion & sales',
  'Writing',
  'Reflection',
];

const themeStorageKey = 'communication-guide-theme';

const getStoredTheme = (): Theme => {
  try {
    return localStorage.getItem(themeStorageKey) === 'dark' ? 'dark' : 'light';
  } catch {
    return 'light';
  }
};

const frameworks: Framework[] = [
  {
    id: 'dearman', acronym: 'DEARMAN', name: 'Describe, Express, Assert, Reinforce, Mindful, Appear confident, Negotiate',
    categories: ['Conflict resolution', 'Persuasion & sales'], tagline: 'Ask for what you need without making the relationship the battleground.',
    description: 'A practical script for making a clear request while staying grounded, respectful, and open to a workable outcome.',
    steps: [
      { letter: 'D', label: 'Describe', description: 'State the observable facts, without interpretation.' },
      { letter: 'E', label: 'Express', description: 'Name how the situation affects you.' },
      { letter: 'A', label: 'Assert', description: 'Ask directly for what you want or need.' },
      { letter: 'R', label: 'Reinforce', description: 'Explain the benefit of meeting the request.' },
      { letter: 'M', label: 'Mindful', description: 'Stay on message; do not get pulled off course.' },
      { letter: 'A', label: 'Appear confident', description: 'Use a steady voice, eye contact, and open posture.' },
      { letter: 'N', label: 'Negotiate', description: 'Invite options when the first solution is not possible.' },
    ],
    howToUse: 'Write the request in one sentence before the conversation. Lead with the facts, then pause after the ask.',
    example: '“The launch notes came in two days late. I felt rushed and worried about quality. Can we agree on a Thursday noon handoff? That gives us room to review.”',
    bestFor: ['Hard asks', 'Repairing friction', 'Negotiating constraints'],
    mnemonic: { word: 'DO IT', cue: 'A seven-rung ladder from facts to a fair ask.', color: '#E98368' },
    sourceNote: 'Commonly associated with DBT interpersonal effectiveness; wording varies by teaching source.',
  },
  {
    id: 'cta', acronym: 'CTA', name: 'Call To Action',
    categories: ['Persuasion & sales', 'Writing', 'Executive updates'], tagline: 'Turn information into a clear next move.',
    description: 'The explicit next step you want the audience to take, turning communication from information into movement.',
    steps: [
      { letter: 'C', label: 'Clear', description: 'Make the action specific and easy to understand.' },
      { letter: 'T', label: 'Timed', description: 'Ask at the right moment, with a useful deadline when needed.' },
      { letter: 'A', label: 'Action', description: 'State exactly what should happen next.' },
    ],
    howToUse: 'Make the action specific, easy to understand, and appropriately timed. In leadership, the CTA can be a decision or commitment.',
    example: '“Approve the research plan by Friday so we can recruit Monday.”',
    bestFor: ['Presentations', 'Emails', 'Product flows', 'Meeting close-outs'],
    mnemonic: { word: 'CTA', cue: 'A small signpost pointing from attention to action.', color: '#D9A441' },
    sourceNote: 'Call To Action is the handbook definition; other fields use practical guidance rather than expanding the acronym.',
  },
  {
    id: 'sbi', acronym: 'SBI', name: 'Situation, Behavior, Impact',
    categories: ['Feedback & coaching'], tagline: 'Make feedback specific enough to be useful.',
    description: 'A neutral feedback frame that separates what happened from the story you might tell about it.',
    steps: [
      { letter: 'S', label: 'Situation', description: 'Anchor the feedback in a particular time and place.' },
      { letter: 'B', label: 'Behavior', description: 'Describe what the person did or said, observably.' },
      { letter: 'I', label: 'Impact', description: 'Explain the effect on people, work, or outcome.' },
    ],
    howToUse: 'Use one recent example. Ask what they noticed before adding your interpretation or request.',
    example: '“In Monday’s planning meeting, you summarized the open risks before we moved on. It helped the group make a decision faster.”',
    bestFor: ['In-the-moment feedback', 'Recognition', 'Behavior change'],
    mnemonic: { word: 'SBI', cue: 'A camera frame: scene, action, ripple.', color: '#6F9E8D' },
  },
  {
    id: 'car', acronym: 'CAR', name: 'Challenge, Action, Result',
    categories: ['Job interviews', 'Storytelling'], tagline: 'Show what you did when the work got real.',
    description: 'A concise accomplishment story that gives an interviewer the problem, your contribution, and the measurable change.',
    steps: [
      { letter: 'C', label: 'Challenge', description: 'Set up the obstacle or goal in a sentence.' },
      { letter: 'A', label: 'Action', description: 'Focus on the choices and work you personally owned.' },
      { letter: 'R', label: 'Result', description: 'Close with the outcome and what you learned.' },
    ],
    howToUse: 'Prepare three stories and keep each to 60–90 seconds. Spend the most time on your actions.',
    example: '“Our onboarding completion had stalled. I mapped the drop-offs and rewrote the first-week emails. Completion rose by 14 points in one quarter.”',
    bestFor: ['Interview answers', 'Portfolio reviews', 'Project retrospectives'],
    mnemonic: { word: 'CAR', cue: 'A route from the roadblock to the destination.', color: '#D67A63' },
  },
  {
    id: 'star', acronym: 'STAR', name: 'Situation, Task, Action, Result',
    categories: ['Job interviews', 'Storytelling'], tagline: 'Give a complete answer without taking the scenic route.',
    description: 'The classic behavioral interview structure: establish the scene, your responsibility, your choices, and the outcome.',
    steps: [
      { letter: 'S', label: 'Situation', description: 'Set the scene and relevant stakes.' },
      { letter: 'T', label: 'Task', description: 'Clarify the goal or responsibility you carried.' },
      { letter: 'A', label: 'Action', description: 'Explain the specific steps you took.' },
      { letter: 'R', label: 'Result', description: 'Share the outcome, evidence, and learning.' },
    ],
    howToUse: 'Answer the question asked, not the story you rehearsed. Use “I” for your contribution and quantify where honest.',
    example: '“A key client was considering leaving. I owned the recovery plan, interviewed their users, and led a revised rollout. They renewed for two years.”',
    bestFor: ['Behavioral interviews', 'Promotion cases', 'Leadership stories'],
    mnemonic: { word: 'STAR', cue: 'Four points that keep a story in orbit.', color: '#B27C9B' },
  },
  {
    id: 'aida', acronym: 'AIDA', name: 'Attention, Interest, Desire, Action',
    categories: ['Persuasion & sales', 'Writing'], tagline: 'Earn attention, then make the next step feel natural.',
    description: 'A buyer-aware persuasion sequence that moves from relevance to motivation to a clear invitation.',
    steps: [
      { letter: 'A', label: 'Attention', description: 'Open with a sharp, relevant hook.' },
      { letter: 'I', label: 'Interest', description: 'Build understanding around the problem.' },
      { letter: 'D', label: 'Desire', description: 'Connect the solution to an outcome they value.' },
      { letter: 'A', label: 'Action', description: 'Ask for one specific next step.' },
    ],
    howToUse: 'Start with the reader’s situation, not your product. Make the action small and explicit.',
    example: '“Still rebuilding the same update every week? One shared brief keeps the decision trail in view. See the two-minute example.”',
    bestFor: ['Sales pages', 'Outreach', 'Calls to action'],
    mnemonic: { word: 'AIDA', cue: 'A funnel that narrows from notice to move.', color: '#D9A441' },
    sourceNote: 'A long-established marketing model; stage names and use vary across sources.',
  },
  {
    id: 'teel', acronym: 'TEEL', name: 'Topic, Explanation, Evidence, Link',
    categories: ['Writing'], tagline: 'Build a paragraph that carries its own weight.',
    description: 'A paragraph-level writing structure for making a point, proving it, interpreting it, and returning to the larger argument.',
    steps: [
      { letter: 'T', label: 'Topic', description: 'Make the paragraph’s main point clear.' },
      { letter: 'E', label: 'Explanation', description: 'Clarify what you mean and why the point matters.' },
      { letter: 'E', label: 'Evidence', description: 'Support the point with a fact, example, quote, or observation.' },
      { letter: 'L', label: 'Link', description: 'Connect back to the thesis or next idea.' },
    ],
    howToUse: 'Underline the first sentence of every paragraph. If it cannot stand alone as a point, revise the topic.',
    example: '“Remote rituals improve handoffs. A short written brief preserves decisions across time zones. That continuity makes distributed work less dependent on memory.”',
    bestFor: ['Essays', 'Strategy docs', 'Thoughtful posts'],
    mnemonic: { word: 'TEEL', cue: 'A brick: point, proof, meaning, mortar.', color: '#6F9E8D' },
  },
  {
    id: 'spin', acronym: 'SPIN', name: 'Situation, Problem, Implication, Need-payoff',
    categories: ['Persuasion & sales'], tagline: 'Ask questions that help the buyer think clearly.',
    description: 'A consultative questioning sequence that surfaces a real need before offering a solution.',
    steps: [
      { letter: 'S', label: 'Situation', description: 'Understand the current process and context.' },
      { letter: 'P', label: 'Problem', description: 'Find the friction, gap, or dissatisfaction.' },
      { letter: 'I', label: 'Implication', description: 'Explore what the problem costs if unchanged.' },
      { letter: 'N', label: 'Need-payoff', description: 'Let the buyer articulate the value of solving it.' },
    ],
    howToUse: 'Be curious, not prosecutorial. Spend more time listening than pitching.',
    example: '“How are handoffs managed now? Where do they slow down? What happens when that delay reaches a customer? What would a cleaner handoff change?”',
    bestFor: ['Discovery calls', 'Needs analysis', 'Consulting'],
    mnemonic: { word: 'SPIN', cue: 'A turn: situation becomes insight, insight becomes motion.', color: '#C86A62' },
    sourceNote: 'Neil Rackham’s consultative selling model; “Need-payoff” is sometimes shortened to “Need.”',
  },
  {
    id: 'desc', acronym: 'DESC', name: 'Describe, Express, Specify, Consequences',
    categories: ['Conflict resolution', 'Feedback & coaching'], tagline: 'Name the issue and the boundary without escalating it.',
    description: 'An assertive script for addressing a difficult behavior and specifying what needs to change.',
    steps: [
      { letter: 'D', label: 'Describe', description: 'State the facts of the situation.' },
      { letter: 'E', label: 'Express', description: 'Share your feelings or concerns.' },
      { letter: 'S', label: 'Specify', description: 'Say what you want to happen next.' },
      { letter: 'C', label: 'Consequences', description: 'Explain the likely positive or negative result.' },
    ],
    howToUse: 'Practice out loud so the request sounds like a boundary, not a verdict.',
    example: '“When meetings run past the agreed time, I lose my next focus block. Let’s end at 3:00 or move open items to a follow-up.”',
    bestFor: ['Boundary setting', 'Difficult conversations', 'Team norms'],
    mnemonic: { word: 'DESC', cue: 'A descent from observation into a clear line.', color: '#E98368' },
  },
  {
    id: 'prep', acronym: 'PREP', name: 'Point, Reason, Example, Point',
    categories: ['Executive updates', 'Persuasion & sales'], tagline: 'Make your answer easy to follow and hard to misquote.',
    description: 'A simple speaking structure that leads with the conclusion and gives it just enough support.',
    steps: [
      { letter: 'P', label: 'Point', description: 'Lead with your answer or recommendation.' },
      { letter: 'R', label: 'Reason', description: 'Give the main reason behind it.' },
      { letter: 'E', label: 'Example', description: 'Ground the reason in evidence or a concrete case.' },
      { letter: 'P', label: 'Point', description: 'Return to the takeaway and next move.' },
    ],
    howToUse: 'Put your point in the first breath. Use one strong example rather than a pile of evidence.',
    example: '“We should delay the launch. The support team needs one more week. Last release created a 30% ticket spike. So I recommend moving to the 18th.”',
    bestFor: ['Q&A', 'Recommendations', 'Concise presentations'],
    mnemonic: { word: 'PREP', cue: 'A loop that lands where it started.', color: '#6F9E8D' },
  },
  {
    id: 'swot', acronym: 'SWOT', name: 'Strengths, Weaknesses, Opportunities, Threats',
    categories: ['Strategy', 'Reflection'], tagline: 'See the landscape before choosing the route.',
    description: 'A four-quadrant scan of internal capabilities and external conditions to support a grounded strategic choice.',
    steps: [
      { letter: 'S', label: 'Strengths', description: 'What do we do unusually well?' },
      { letter: 'W', label: 'Weaknesses', description: 'Where are we exposed or underpowered?' },
      { letter: 'O', label: 'Opportunities', description: 'What external opening could we pursue?' },
      { letter: 'T', label: 'Threats', description: 'What external force could make the plan harder?' },
    ],
    howToUse: 'Separate internal from external. End by naming the one strategic choice the scan changes.',
    example: '“Our trust with existing users is a strength; discoverability is weak. A new partner channel is open, but a larger competitor is entering.”',
    bestFor: ['Planning', 'Retrospectives', 'Decision framing'],
    mnemonic: { word: 'SWOT', cue: 'A window with four panes: inside, outside, upside, risk.', color: '#D9A441' },
  },
  {
    id: 'sbar', acronym: 'SBAR', name: 'Situation, Background, Assessment, Recommendation',
    categories: ['Executive updates'], tagline: 'Give a busy decision-maker the signal first.',
    description: 'A concise handoff format designed to make the current situation and requested decision immediately clear.',
    steps: [
      { letter: 'S', label: 'Situation', description: 'What is happening right now?' },
      { letter: 'B', label: 'Background', description: 'What context is essential?' },
      { letter: 'A', label: 'Assessment', description: 'What do you think is going on?' },
      { letter: 'R', label: 'Recommendation', description: 'What action do you recommend?' },
    ],
    howToUse: 'Use headings when writing. Put the recommendation in the subject line when possible.',
    example: '“Situation: checkout is failing for mobile users. Background: the issue began after Tuesday’s deploy. Assessment: a payment SDK conflict. Recommendation: roll back and patch tomorrow.”',
    bestFor: ['Escalations', 'Handoffs', 'Risk updates'],
    mnemonic: { word: 'SBAR', cue: 'A baton pass: signal, context, read, handoff.', color: '#B27C9B' },
    sourceNote: 'Adapted across healthcare and other high-reliability environments; context details vary.',
  },
  {
    id: '321', acronym: '3–2–1', name: 'Three takeaways, two observations, one question or next action',
    categories: ['Reflection', 'Executive updates'], tagline: 'Leave a meeting with a usable memory.',
    description: 'A lightweight reflection and recap format for converting a dense conversation into action.',
    steps: [
      { letter: '3', label: 'Takeaways', description: 'Capture the three ideas that matter most.' },
      { letter: '2', label: 'Observations', description: 'Capture two interesting or surprising observations.' },
      { letter: '1', label: 'Question / action', description: 'Name one question, insight, or next action.' },
    ],
    howToUse: 'Complete it within five minutes of a meeting, talk, or study session.',
    example: '“Three: scope is smaller, trust is the differentiator, launch needs support. Two: pricing and staffing. One: Maya drafts the scope by Thursday.”',
    bestFor: ['Meeting notes', 'Learning', 'Weekly reviews'],
    mnemonic: { word: '3–2–1', cue: 'A countdown from many thoughts to one move.', color: '#E98368' },
  },
  {
    id: 'coin', acronym: 'COIN', name: 'Context, Observation, Impact, Next step',
    categories: ['Feedback & coaching'], tagline: 'Coach toward the future without losing the facts.',
    description: 'A feedback model that pairs a grounded observation with its effect and an invitation to improve.',
    steps: [
      { letter: 'C', label: 'Context', description: 'Set the time, place, and purpose.' },
      { letter: 'O', label: 'Observation', description: 'Describe what you saw or heard.' },
      { letter: 'I', label: 'Impact', description: 'Explain the result for the work or people.' },
      { letter: 'N', label: 'Next step', description: 'Agree on a practical change or continuation.' },
    ],
    howToUse: 'End with collaboration: ask what would make the next version easier.',
    example: '“In yesterday’s review, you asked for concerns before sharing your proposal. It surfaced risk early. Keep that opening, and leave two minutes to cluster the themes.”',
    bestFor: ['Manager 1:1s', 'Peer coaching', 'Performance conversations'],
    mnemonic: { word: 'COIN', cue: 'A coin has two sides: what happened and what happens next.', color: '#6F9E8D' },
  },
  {
    id: 'scqa', acronym: 'SCQA', name: 'Situation, Complication, Question, Answer',
    categories: ['Storytelling', 'Executive updates', 'Writing'], tagline: 'Create the question your answer resolves.',
    description: 'A narrative logic for introducing a shared reality, raising tension, clarifying the question, and answering it.',
    steps: [
      { letter: 'S', label: 'Situation', description: 'Establish common ground.' },
      { letter: 'C', label: 'Complication', description: 'Introduce the change or obstacle.' },
      { letter: 'Q', label: 'Question', description: 'Make the decision or inquiry explicit.' },
      { letter: 'A', label: 'Answer', description: 'Give the recommendation or resolution.' },
    ],
    howToUse: 'If the question is not interesting, revisit the complication. If the answer is buried, move it up.',
    example: '“Our team has grown across three time zones. Decisions now get repeated in private chats. How can we keep speed without losing context? Adopt one written decision log.”',
    bestFor: ['Narrative memos', 'Presentations', 'Strategic proposals'],
    mnemonic: { word: 'SCQA', cue: 'A bridge: familiar shore, gap, crossing question, landing.', color: '#D67A63' },
    sourceNote: 'Associated with Barbara Minto’s Pyramid Principle; formulations vary.',
  },
  {
    id: 'fab', acronym: 'FAB', name: 'Features, Advantages, Benefits',
    categories: ['Persuasion & sales'], tagline: 'Translate what it is into why it matters.',
    description: 'A value translation tool that moves from a product detail to its practical advantage and the customer outcome.',
    steps: [
      { letter: 'F', label: 'Feature', description: 'Name the concrete attribute or capability.' },
      { letter: 'A', label: 'Advantage', description: 'Explain what that attribute enables.' },
      { letter: 'B', label: 'Benefit', description: 'Connect it to the customer’s desired result.' },
    ],
    howToUse: 'Do not stop at the feature. Ask “so what?” until the benefit is felt in the buyer’s world.',
    example: '“The notes are searchable. You can find decisions without replaying a meeting. Your next briefing starts with confidence, not archaeology.”',
    bestFor: ['Product stories', 'Demos', 'Value propositions'],
    mnemonic: { word: 'FAB', cue: 'A three-step translation: thing, use, difference.', color: '#D9A441' },
  },
  {
    id: 'pastor', acronym: 'PASTOR', name: 'Problem, Amplify, Story / Solution, Transformation, Offer, Response',
    categories: ['Persuasion & sales', 'Storytelling'], tagline: 'Move from a real problem to a credible invitation.',
    description: 'A long-form persuasion arc that builds empathy, stakes, proof, an offer, and a clear response.',
    steps: [
      { letter: 'P', label: 'Problem', description: 'Name the audience’s real problem.' },
      { letter: 'A', label: 'Amplify', description: 'Make the cost of staying stuck visible.' },
      { letter: 'S', label: 'Story / Solution', description: 'Introduce the answer through a credible story or solution.' },
      { letter: 'T', label: 'Transformation', description: 'Paint the better future the audience can move toward.' },
      { letter: 'O', label: 'Offer', description: 'Present the specific solution.' },
      { letter: 'R', label: 'Response', description: 'Invite one clear action.' },
    ],
    howToUse: 'Use restraint with amplification: illuminate the stakes without manufacturing fear.',
    example: '“Important decisions are disappearing after meetings. That creates rework and quiet doubt. A team kept a decision ledger for 30 days and cut repeat debates. Start with the free template.”',
    bestFor: ['Long-form pages', 'Campaigns', 'Case studies'],
    mnemonic: { word: 'PASTOR', cue: 'A guided path: concern, meaning, proof, invitation.', color: '#B27C9B' },
    sourceNote: 'The handbook uses Story / Solution and Transformation; other copywriting sources use related variants.',
  },
  {
    id: 'oars', acronym: 'OARS', name: 'Open questions, Affirmations, Reflections, Summaries',
    categories: ['Feedback & coaching', 'Conflict resolution'], tagline: 'Make listening visible.',
    description: 'A motivational interviewing skill set for helping someone think aloud without taking over their thinking.',
    steps: [
      { letter: 'O', label: 'Open questions', description: 'Invite a story instead of a yes/no answer.' },
      { letter: 'A', label: 'Affirmations', description: 'Recognize effort, values, or useful insight.' },
      { letter: 'R', label: 'Reflections', description: 'Mirror content or feeling to show understanding.' },
      { letter: 'S', label: 'Summaries', description: 'Gather the thread and check your understanding.' },
    ],
    howToUse: 'Reflect before advising. A good summary ends with “What did I miss?”',
    example: '“You have been carrying the deadline and the uncertainty. You want clarity, but not another meeting. Did I get that right?”',
    bestFor: ['Coaching', 'Listening', 'Sensitive conversations'],
    mnemonic: { word: 'OARS', cue: 'A boat moves when listening provides the oars.', color: '#6F9E8D' },
    sourceNote: 'Motivational interviewing skill set; originally associated with Miller and Rollnick.',
  },
  {
    id: 'nvc', acronym: 'NVC', name: 'Observation, Feeling, Need, Request',
    categories: ['Conflict resolution', 'Reflection'], tagline: 'Say what is true without turning it into a verdict.',
    description: 'A compassionate communication structure for separating observations from judgments and making a doable request.',
    steps: [
      { letter: 'O', label: 'Observation', description: 'Describe what happened without evaluation.' },
      { letter: 'F', label: 'Feeling', description: 'Name the emotion you experience.' },
      { letter: 'N', label: 'Need', description: 'Identify the value or need underneath.' },
      { letter: 'R', label: 'Request', description: 'Ask for a concrete, present-tense action.' },
    ],
    howToUse: 'Own your feeling and need; do not use the format to disguise a demand.',
    example: '“When the plan changes without a note, I feel unsettled because I need shared context. Would you add a two-line update to the channel?”',
    bestFor: ['Repair', 'Boundaries', 'Emotional clarity'],
    mnemonic: { word: 'NVC', cue: 'A bridge from what happened to what could help.', color: '#E98368' },
    sourceNote: 'Based on Nonviolent Communication; some sources call the first step “observation.”',
  },
  {
    id: 'bluf', acronym: 'BLUF', name: 'Bottom Line Up Front',
    categories: ['Executive updates', 'Writing'], tagline: 'Respect attention by leading with the answer.',
    description: 'A writing discipline that places the conclusion before supporting details, so a reader can orient instantly.',
    steps: [
      { letter: 'B', label: 'Bottom line', description: 'State the decision, status, or recommendation first.' },
      { letter: 'L', label: 'Logic', description: 'Give the two or three reasons that support it.' },
      { letter: 'U', label: 'Useful detail', description: 'Add context for readers who need to go deeper.' },
      { letter: 'F', label: 'Follow-through', description: 'Make ownership and next action explicit.' },
    ],
    howToUse: 'Write the subject line after the document, then make it your opening sentence.',
    example: '“Recommendation: approve the pilot for two teams. It is low-risk, uses existing tooling, and gives us evidence before a wider rollout.”',
    bestFor: ['Email', 'Leadership notes', 'Decision logs'],
    mnemonic: { word: 'BLUF', cue: 'A flag planted at the top of the page.', color: '#D9A441' },
    sourceNote: 'Common in military and operational writing; this expansion is a practical guide, not the acronym itself.',
  },
  {
    id: 'race', acronym: 'RACE', name: 'Research, Action, Communication, Evaluation',
    categories: ['Strategy', 'Persuasion & sales'], tagline: 'Treat communication as a cycle, not a broadcast.',
    description: 'A planning loop for grounding a communication effort in evidence, executing it, and learning from the result.',
    steps: [
      { letter: 'R', label: 'Research', description: 'Understand people, context, and the problem.' },
      { letter: 'A', label: 'Action', description: 'Choose the intervention or message.' },
      { letter: 'C', label: 'Communication', description: 'Deliver it through the right channel.' },
      { letter: 'E', label: 'Evaluation', description: 'Check what changed and adjust.' },
    ],
    howToUse: 'Set one observable signal before you start. Evaluation is part of the plan, not an afterthought.',
    example: '“Interview three customers, simplify the activation email, send it to one cohort, then compare completion and replies.”',
    bestFor: ['Campaigns', 'Change communication', 'Planning'],
    mnemonic: { word: 'RACE', cue: 'A track with four bends; every lap teaches the next.', color: '#C86A62' },
    sourceNote: 'Used in public relations and communication planning with alternate expansions.',
  },
  {
    id: '5w1h', acronym: '5W1H', name: 'Who, What, When, Where, Why, How',
    categories: ['Writing', 'Strategy'], tagline: 'Close the gaps that create avoidable questions.',
    description: 'A completeness check for briefs, announcements, reporting, and any message where missing context causes friction.',
    steps: [
      { letter: 'W', label: 'Who', description: 'Who is involved or affected?' },
      { letter: 'W', label: 'What', description: 'What is happening or needed?' },
      { letter: 'W', label: 'When', description: 'What is the timing or deadline?' },
      { letter: 'W', label: 'Where', description: 'Where does it happen or live?' },
      { letter: 'W', label: 'Why', description: 'Why does it matter?' },
      { letter: 'H', label: 'How', description: 'How will it work or be done?' },
    ],
    howToUse: 'Use it as a final scan, not a demand to answer every question in every message.',
    example: '“The research review is Thursday at 10:00 in the project room; Kai is leading it to decide which concept moves into testing.”',
    bestFor: ['Briefs', 'Announcements', 'Project kickoffs'],
    mnemonic: { word: '5W1H', cue: 'A journalist’s six-pocket field kit.', color: '#6F9E8D' },
  },
  {
    id: 'grow', acronym: 'GROW', name: 'Goal, Reality, Options, Will',
    categories: ['Feedback & coaching', 'Reflection'], tagline: 'Turn a stuck conversation toward agency.',
    description: 'A coaching sequence for clarifying a desired outcome, facing the current reality, exploring choices, and committing to action.',
    steps: [
      { letter: 'G', label: 'Goal', description: 'What would make this conversation useful?' },
      { letter: 'R', label: 'Reality', description: 'What is true now, including constraints?' },
      { letter: 'O', label: 'Options', description: 'What paths are available?' },
      { letter: 'W', label: 'Will', description: 'What will you do, by when?' },
    ],
    howToUse: 'Let the other person generate options before you add yours.',
    example: '“What would a good handoff look like? What is happening now? What are three ways to change it? Which one will you try this week?”',
    bestFor: ['1:1s', 'Career conversations', 'Self-coaching'],
    mnemonic: { word: 'GROW', cue: 'A seedling: aim, ground, branches, commitment.', color: '#B27C9B' },
    sourceNote: 'A widely used coaching model; “Will” is sometimes expressed as “Way forward.”',
  },
  {
    id: 'fefo', acronym: 'FEFO', name: 'First, Explain, Follow-up, Observe',
    categories: ['Feedback & coaching'], tagline: 'Make a correction teachable, not merely immediate.',
    description: 'A practical conversation loop for naming the issue, explaining the standard, checking back, and noticing progress.',
    steps: [
      { letter: 'F', label: 'First', description: 'Address the behavior close to when it occurs.' },
      { letter: 'E', label: 'Explain', description: 'Clarify the impact and expected standard.' },
      { letter: 'F', label: 'Follow-up', description: 'Agree when you will revisit it.' },
      { letter: 'O', label: 'Observe', description: 'Notice and reinforce the change.' },
    ],
    howToUse: 'Use privately and promptly; separate a learning moment from a public performance.',
    example: '“The handoff missed the owner field. That leaves the next person guessing. Let’s check tomorrow’s version together, then I’ll step back.”',
    bestFor: ['On-the-job coaching', 'Process habits', 'New managers'],
    mnemonic: { word: 'FEFO', cue: 'A loop: point, teach, return, notice.', color: '#E98368' },
    sourceNote: 'A practical variant label used in coaching contexts; not a universal acronym.',
  },
  {
    id: 'kiss', acronym: 'KISS', name: 'Keep It Simple, Specific',
    categories: ['Writing', 'Executive updates'], tagline: 'Remove the fog before adding the flourish.',
    description: 'A reminder to reduce cognitive load: prefer plain words, one idea, and an action the reader can see.',
    steps: [
      { letter: 'K', label: 'Keep', description: 'Protect the essential point.' },
      { letter: 'I', label: 'It', description: 'Keep the message about the reader’s need.' },
      { letter: 'S', label: 'Simple', description: 'Use direct language and an uncluttered structure.' },
      { letter: 'S', label: 'Specific', description: 'Name the owner, output, or next action.' },
    ],
    howToUse: 'Cut one layer of abstraction, then read it aloud to find the sentence that is trying too hard.',
    example: 'Replace “circle back regarding alignment” with “Please approve the scope by Friday.”',
    bestFor: ['Editing', 'Requests', 'Team communication'],
    mnemonic: { word: 'KISS', cue: 'A clean line drawn through the clutter.', color: '#D67A63' },
    sourceNote: 'This app uses a communication-friendly expansion; the acronym has other common variants.',
  },
  {
    id: 'minto', acronym: 'PYRAMID', name: 'Minto Pyramid Principle',
    categories: ['Strategy', 'Writing', 'Executive updates'], tagline: 'Group thinking so the conclusion can travel.',
    description: 'A top-down logic for presenting the answer first, then grouping mutually supportive arguments beneath it.',
    steps: [
      { letter: '1', label: 'Answer', description: 'Lead with the governing recommendation.' },
      { letter: '2', label: 'Arguments', description: 'Group the reasons that support the answer.' },
      { letter: '3', label: 'Evidence', description: 'Support each group with facts or examples.' },
    ],
    howToUse: 'Check that each group answers the same question and that the groups do not overlap.',
    example: '“Choose the partner route. It reaches the right audience, lowers delivery risk, and gives us learning sooner.”',
    bestFor: ['Board updates', 'Consulting decks', 'Complex decisions'],
    mnemonic: { word: 'PYRAMID', cue: 'A wide base of evidence narrowing to one point.', color: '#D9A441' },
    sourceNote: 'Barbara Minto’s framework is often represented as a pyramid rather than an acronym.',
  },
  {
    id: 'fivecs', acronym: '5 Cs', name: 'Clear, Concise, Concrete, Correct, Coherent',
    categories: ['Writing'], tagline: 'A final edit that respects the reader.',
    description: 'Five quality checks for messages that need to be understood, trusted, and remembered.',
    steps: [
      { letter: 'C', label: 'Clear', description: 'Can the reader tell what this means?' },
      { letter: 'C', label: 'Concise', description: 'Is every sentence earning its place?' },
      { letter: 'C', label: 'Concrete', description: 'Could someone act on the detail?' },
      { letter: 'C', label: 'Correct', description: 'Are the facts, names, and mechanics sound?' },
      { letter: 'C', label: 'Coherent', description: 'Does the sequence make sense?' },
    ],
    howToUse: 'Run one C per pass. Editing for everything at once makes weak sentences hard to see.',
    example: '“Launch moves to 18 June. Priya owns QA; Marco owns the customer note. Please flag blockers by noon Friday.”',
    bestFor: ['Important emails', 'Proposals', 'Documentation'],
    mnemonic: { word: '5 Cs', cue: 'Five small lenses for one polished message.', color: '#6F9E8D' },
  },
  {
    id: 'hail', acronym: 'HAIL', name: 'Honesty, Authenticity, Integrity, Love',
    categories: ['Reflection', 'Conflict resolution'], tagline: 'Build the kind of trust your words can carry.',
    description: 'A character check for speaking with truth, congruence, values, and genuine care for the other person.',
    steps: [
      { letter: 'H', label: 'Honesty', description: 'Say what you believe is true.' },
      { letter: 'A', label: 'Authenticity', description: 'Let the message sound like you.' },
      { letter: 'I', label: 'Integrity', description: 'Align words with values and action.' },
      { letter: 'L', label: 'Love', description: 'Hold the person’s dignity while being direct.' },
    ],
    howToUse: 'Before a hard conversation, ask which part you are avoiding and what care would make directness possible.',
    example: '“I value our partnership, and I need to be direct: this timeline is not achievable with the current scope.”',
    bestFor: ['Difficult truths', 'Leadership presence', 'Reflection'],
    mnemonic: { word: 'HAIL', cue: 'Four weather vanes pointing words toward trust.', color: '#B27C9B' },
    sourceNote: 'Popularized as a trust-building communication mnemonic; terminology is not universal.',
  },
];

function Mnemonic({ framework, large = false }: { framework: Framework; large?: boolean }) {
  const initials = framework.acronym.replace(/[^A-Z0-9]/gi, '').slice(0, 4);
  return (
    <div
      className={`mnemonic-orb relative flex shrink-0 items-center justify-center overflow-hidden rounded-[1.15rem] ${large ? 'h-28 w-28' : 'h-20 w-20'}`}
      style={{ backgroundColor: `${framework.mnemonic.color}22`, color: framework.mnemonic.color }}
      aria-label={`Mnemonic: ${framework.mnemonic.word}. ${framework.mnemonic.cue}`}
    >
      <span className="absolute -right-5 -top-5 h-16 w-16 rounded-full border-2 border-current opacity-30 mnemonic-orbit" />
      <span className="absolute bottom-1 left-2 h-3 w-3 rounded-full bg-current opacity-60 mnemonic-pulse" />
      <span className={`relative font-mono-ui font-bold tracking-tight ${large ? 'text-xl' : 'text-base'}`}>{initials}</span>
    </div>
  );
}

function App() {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('All');
  const [favoritesOnly, setFavoritesOnly] = useState(false);
  const [theme, setTheme] = useState<Theme>(getStoredTheme);
  const [favorites, setFavorites] = useState<string[]>(() => {
    try { return JSON.parse(localStorage.getItem('communication-guide-favorites') || '[]'); } catch { return []; }
  });
  const [selected, setSelected] = useState<Framework | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    localStorage.setItem('communication-guide-favorites', JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    try {
      localStorage.setItem(themeStorageKey, theme);
    } catch {
      // Theme still applies when storage is unavailable.
    }
  }, [theme]);

  useEffect(() => {
    document.body.style.overflow = selected ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [selected]);

  const toggleFavorite = (id: string) => {
    setFavorites((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id]);
  };

  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return frameworks.filter((framework) => {
      const searchable = [
        framework.acronym, framework.name, framework.tagline, framework.description,
        framework.howToUse, framework.example, framework.mnemonic.word, framework.mnemonic.cue,
        ...framework.categories, ...framework.bestFor, ...framework.steps.flatMap((step) => [step.label, step.description]),
      ].join(' ').toLowerCase();
      const matchesQuery = !normalized || searchable.includes(normalized);
      const matchesCategory = category === 'All' || framework.categories.includes(category);
      const matchesFavorites = !favoritesOnly || favorites.includes(framework.id);
      return matchesQuery && matchesCategory && matchesFavorites;
    });
  }, [category, favorites, favoritesOnly, query]);

  const categoryCounts = useMemo(
    () =>
      Object.fromEntries(
        categories.map((item) => [
          item,
          item === 'All'
            ? frameworks.length
            : frameworks.filter((framework) => framework.categories.includes(item)).length,
        ]),
      ) as Record<string, number>,
    [],
  );

  const clearFilters = () => { setQuery(''); setCategory('All'); setFavoritesOnly(false); };

  const openFramework = (framework: Framework) => { setSelected(framework); setCopied(false); };
  const copyFramework = async () => {
    if (!selected) return;
    const text = `${selected.acronym} — ${selected.name}\n\n${selected.steps.map((step) => `${step.letter}. ${step.label}: ${step.description}`).join('\n')}\n\nNext move: ${selected.howToUse}`;
    try { await navigator.clipboard.writeText(text); } catch { /* Clipboard can be unavailable in some browsers. */ }
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  };

  return (
    <div className="app-shell grain scientific-ui min-h-[100dvh]">
      <header className="site-header mx-auto flex max-w-7xl items-center justify-between px-5 py-5 sm:px-8 lg:px-12">
        <div className="flex items-center gap-3">
          <div className="brand-mark flex h-10 w-10 items-center justify-center rounded-xl bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] shadow-[var(--shadow-sm)]">
            <BookOpen size={19} strokeWidth={2.2} />
          </div>
          <div>
            <div className="font-display text-lg font-semibold leading-none tracking-[-.02em]">Field Notes</div>
            <div className="mt-1 font-mono-ui text-[9px] uppercase tracking-[.16em] text-[hsl(var(--muted-foreground))]">Communication Framework Guide</div>
          </div>
        </div>
        <div className="header-signal hidden items-center gap-2 text-xs text-[hsl(var(--muted-foreground))] sm:flex">
          <span className="h-2 w-2 rounded-full bg-[hsl(var(--accent))]" />
          Live reference / 28 structures
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            data-testid="button-theme-toggle"
            onClick={() => setTheme((value) => value === 'dark' ? 'light' : 'dark')}
            className="flex min-h-10 items-center gap-2 rounded-full border border-[hsl(var(--border))] bg-[hsl(var(--card)/.7)] px-3 text-xs font-semibold text-[hsl(var(--foreground))] transition-colors hover:border-[hsl(var(--primary)/.5)]"
            aria-label={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
            aria-pressed={theme === 'dark'}
          >
            {theme === 'dark' ? <Sun size={15} /> : <Moon size={15} />}
            <span>{theme === 'dark' ? 'Light mode' : 'Dark lab'}</span>
          </button>
          <button
            type="button"
            data-testid="button-favorites-header"
            onClick={() => setFavoritesOnly((value) => !value)}
            className={`flex min-h-10 items-center gap-2 rounded-full border px-3.5 text-xs font-semibold transition-colors ${favoritesOnly ? 'border-[hsl(var(--primary))] bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))]' : 'border-[hsl(var(--border))] bg-[hsl(var(--card)/.7)] text-[hsl(var(--foreground))] hover:border-[hsl(var(--primary)/.5)]'}`}
            aria-pressed={favoritesOnly}
          >
            <Heart size={15} fill={favoritesOnly ? 'currentColor' : 'none'} />
            <span className="hidden sm:inline">Saved</span>
            <span>{favorites.length}</span>
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-5 pb-16 sm:px-8 lg:px-12">
        <section className="hero-panel relative pb-10 pt-9 sm:pb-14 sm:pt-16">
          <div className="max-w-3xl">
            <p className="mb-4 flex items-center gap-2 font-mono-ui text-[10px] uppercase tracking-[.2em] text-[hsl(var(--primary))]">
              <Sparkles size={14} /> Find the shape of what you mean
            </p>
            <h1 className="hero-title font-display text-[clamp(2.8rem,8vw,6.4rem)] leading-[.91] tracking-[-.055em] text-[hsl(var(--foreground))]">
              The right words,<br /><em className="hero-accent">when it matters.</em>
            </h1>
            <p className="hero-copy mt-6 max-w-xl text-[15px] leading-7 sm:text-lg">
              A field guide to the structures behind clear conversations. Find a framework, remember it with a cue, and take one useful next step.
            </p>
          </div>
          <div aria-hidden="true" className="hero-orbit absolute right-0 top-16 hidden h-36 w-36 rounded-full border border-[hsl(var(--primary)/.18)] md:block lg:right-16">
            <div className="absolute inset-5 rounded-full border border-dashed border-[hsl(var(--accent)/.5)]" />
            <div className="absolute left-1/2 top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[hsl(var(--accent))]" />
          </div>
        </section>

        <section className="filter-dock sticky top-0 z-30 -mx-5 border-y border-[hsl(var(--border)/.7)] px-5 py-4 backdrop-blur-md sm:-mx-8 sm:px-8 lg:-mx-12 lg:px-12">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
            <label className="search-control relative block flex-1 rounded-xl">
              <Search className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[hsl(var(--muted-foreground))]" size={18} />
              <input
                type="search"
                data-testid="input-search-frameworks"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search an acronym, situation, or next move..."
                className="h-12 w-full rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card)/.85)] pl-11 pr-10 text-sm text-[hsl(var(--foreground))] outline-none transition-shadow placeholder:text-[hsl(var(--muted-foreground))] focus:border-[hsl(var(--primary)/.6)] focus:ring-4 focus:ring-[hsl(var(--primary)/.1)]"
              />
              {query && <button type="button" data-testid="button-clear-search" onClick={() => setQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1.5 text-[hsl(var(--muted-foreground))] hover:bg-[hsl(var(--muted))]"><X size={15} /></button>}
            </label>
            <button
              type="button"
              data-testid="button-toggle-favorites"
              onClick={() => setFavoritesOnly((value) => !value)}
              className={`flex h-12 shrink-0 items-center justify-center gap-2 rounded-xl border px-4 text-sm font-semibold transition-colors ${favoritesOnly ? 'border-[hsl(var(--primary))] bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))]' : 'border-[hsl(var(--border))] bg-[hsl(var(--card)/.85)] hover:bg-[hsl(var(--muted))]'}`}
              aria-pressed={favoritesOnly}
            >
              <Star size={16} fill={favoritesOnly ? 'currentColor' : 'none'} /> Saved only
              <span className="font-mono-ui text-[10px] opacity-75" aria-hidden="true">({favorites.length})</span>
            </button>
          </div>
          <div className="filter-strip mt-3 flex items-center gap-2 overflow-x-auto pb-0.5 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            <SlidersHorizontal size={15} className="mr-1 shrink-0 text-[hsl(var(--muted-foreground))]" />
            {categories.map((item) => (
              <button
                type="button"
                key={item}
                data-testid={`button-filter-${item.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`}
                onClick={() => setCategory(item)}
                className={`filter-chip min-h-9 shrink-0 rounded-full border px-3.5 text-xs font-medium transition-colors ${category === item ? 'border-[hsl(var(--primary))] bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))]' : 'border-[hsl(var(--border))] bg-[hsl(var(--card)/.55)] text-[hsl(var(--muted-foreground))] hover:border-[hsl(var(--primary)/.45)] hover:text-[hsl(var(--foreground))]'}`}
                aria-pressed={category === item}
                aria-label={`${item}: ${categoryCounts[item]} ${categoryCounts[item] === 1 ? 'framework' : 'frameworks'}`}
                data-active={category === item}
              >
                {item}
                <span className="ml-1 font-mono-ui text-[10px] opacity-75" aria-hidden="true">({categoryCounts[item]})</span>
              </button>
            ))}
          </div>
        </section>

        <section className="pt-8">
          <div className="mb-5 flex items-end justify-between gap-4">
            <div>
              <p className="result-kicker">Your working library</p>
              <h2 className="result-heading mt-1 font-display text-2xl font-semibold sm:text-3xl">
                {filtered.length} <span className="text-[hsl(var(--muted-foreground))]">{filtered.length === 1 ? 'framework' : 'frameworks'}</span>
              </h2>
            </div>
            {(query || category !== 'All' || favoritesOnly) && (
              <button type="button" data-testid="button-clear-filters" onClick={clearFilters} className="flex items-center gap-1.5 rounded-lg px-2 py-2 text-xs font-semibold text-[hsl(var(--primary))] hover:bg-[hsl(var(--primary)/.08)]">
                Clear filters <X size={14} />
              </button>
            )}
          </div>

          {filtered.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {filtered.map((framework, index) => (
                <article
                  key={framework.id}
                  data-testid={`card-framework-${framework.id}`}
                  onClick={() => openFramework(framework)}
                  onKeyDown={(event) => { if (event.key === 'Enter' || event.key === ' ') openFramework(framework); }}
                  role="button"
                  tabIndex={0}
                  className="framework-card group cursor-pointer rounded-2xl border border-[hsl(var(--card-border))] bg-[hsl(var(--card)/.82)] p-5 shadow-[var(--shadow-sm)]"
                  style={{ animationDelay: `${Math.min(index * 35, 280)}ms` }}
                >
                  <div className="flex items-start justify-between gap-4">
                    <Mnemonic framework={framework} />
                    <button
                      type="button"
                      aria-label={`${favorites.includes(framework.id) ? 'Remove' : 'Save'} ${framework.acronym}`}
                      data-testid={`button-favorite-${framework.id}`}
                      onClick={(event) => { event.stopPropagation(); toggleFavorite(framework.id); }}
                      className={`flex h-10 w-10 items-center justify-center rounded-full border transition-all ${favorites.includes(framework.id) ? 'border-[hsl(var(--accent)/.5)] bg-[hsl(var(--accent)/.14)] text-[hsl(var(--accent))]' : 'border-transparent text-[hsl(var(--muted-foreground))] hover:border-[hsl(var(--border))] hover:bg-[hsl(var(--muted))]'}`}
                    >
                      <Heart size={17} fill={favorites.includes(framework.id) ? 'currentColor' : 'none'} />
                    </button>
                  </div>
                  <div className="mt-5">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono-ui text-xs font-bold tracking-[.08em] text-[hsl(var(--primary))]">{framework.acronym}</span>
                      <span className="text-[hsl(var(--border))]">/</span>
                      <span className="text-[10px] font-semibold uppercase tracking-[.1em] text-[hsl(var(--muted-foreground))]">{framework.categories[0]}</span>
                    </div>
                    <h3 className="mt-2 text-lg font-semibold tracking-[-.025em]">{framework.name}</h3>
                    <p className="mt-2 line-clamp-2 text-sm leading-6 text-[hsl(var(--muted-foreground))]">{framework.description}</p>
                  </div>
                  <div className="mt-5 flex items-center justify-between border-t border-[hsl(var(--border)/.7)] pt-4">
                    <span className="text-xs font-medium text-[hsl(var(--muted-foreground))]">{framework.steps.length} steps <span className="mx-1">·</span> {framework.mnemonic.word}</span>
                    <span className="flex items-center gap-1 text-xs font-semibold text-[hsl(var(--primary))] transition-transform group-hover:translate-x-0.5">Open guide <ArrowRight size={14} /></span>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-[hsl(var(--border))] bg-[hsl(var(--card)/.55)] px-6 py-16 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[hsl(var(--accent)/.14)] text-[hsl(var(--accent))]"><Search size={23} /></div>
              <h3 className="mt-5 font-display text-2xl font-semibold">Nothing in this pocket.</h3>
              <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-[hsl(var(--muted-foreground))]">Try a different phrase, or clear the filters and browse the full field guide.</p>
              <button type="button" data-testid="button-empty-clear" onClick={clearFilters} className="mt-6 inline-flex min-h-11 items-center gap-2 rounded-xl bg-[hsl(var(--primary))] px-4 text-sm font-semibold text-[hsl(var(--primary-foreground))] hover:opacity-90">Show all frameworks <ArrowRight size={15} /></button>
            </div>
          )}
        </section>
      </main>

      <footer className="border-t border-[hsl(var(--border)/.7)] bg-[hsl(var(--card)/.3)]">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-5 py-7 text-xs text-[hsl(var(--muted-foreground))] sm:flex-row sm:items-center sm:justify-between sm:px-8 lg:px-12">
          <p className="flex items-center gap-2"><BookOpen size={14} className="text-[hsl(var(--primary))]" /> Keep this close for the conversation you are preparing to have.</p>
          <p className="font-mono-ui text-[10px] uppercase tracking-[.12em]">Local guide · {frameworks.length} structures · no account needed</p>
        </div>
      </footer>

      {selected && (
        <div className="detail-backdrop fixed inset-0 z-40 flex items-end justify-center p-0 backdrop-blur-sm sm:items-center sm:p-5" onMouseDown={(event) => { if (event.target === event.currentTarget) setSelected(null); }}>
          <div role="dialog" aria-modal="true" aria-labelledby="framework-title" className="detail-sheet max-h-[94dvh] w-full overflow-y-auto rounded-t-3xl border sm:max-w-3xl sm:rounded-3xl">
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-[hsl(var(--border)/.7)] bg-[hsl(var(--card)/.94)] px-5 py-4 backdrop-blur-md sm:px-7">
              <span className="modal-kicker">Field guide / {selected.categories[0]}</span>
              <div className="flex items-center gap-2">
                <button type="button" data-testid="button-copy-framework" onClick={copyFramework} className="flex min-h-10 items-center gap-2 rounded-lg px-3 text-xs font-semibold text-[hsl(var(--muted-foreground))] hover:bg-[hsl(var(--muted))] hover:text-[hsl(var(--foreground))]">
                  {copied ? <Check size={15} /> : <Copy size={15} />} {copied ? 'Copied' : 'Copy'}
                </button>
                <button type="button" data-testid="button-close-framework" onClick={() => setSelected(null)} aria-label="Close framework" className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-[hsl(var(--muted))]"><X size={19} /></button>
              </div>
            </div>
            <div className="p-5 sm:p-8">
              <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
                <Mnemonic framework={selected} large />
                <div className="min-w-0">
                  <div className="font-mono-ui text-sm font-bold tracking-[.12em] text-[hsl(var(--primary))]">{selected.acronym}</div>
                  <h2 id="framework-title" className="mt-1 font-display text-3xl font-semibold leading-tight tracking-[-.035em] sm:text-4xl">{selected.name}</h2>
                  <p className="mt-3 text-base leading-7 text-[hsl(var(--muted-foreground))]">{selected.tagline}</p>
                </div>
              </div>
              <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_260px]">
                <div>
                  <div className="mb-4 flex items-center justify-between">
                    <h3 className="font-mono-ui text-[10px] font-bold uppercase tracking-[.18em] text-[hsl(var(--muted-foreground))]">The structure</h3>
                    <span className="text-xs text-[hsl(var(--muted-foreground))]">{selected.steps.length} moves</span>
                  </div>
                  <div className="space-y-2">
                    {selected.steps.map((step, index) => (
                      <div key={`${step.letter}-${step.label}`} className="step-item flex gap-3 rounded-xl border p-3.5">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[hsl(var(--primary)/.1)] font-mono-ui text-xs font-bold text-[hsl(var(--primary))]">{step.letter}</div>
                        <div><div className="text-sm font-semibold">{step.label}</div><p className="mt-0.5 text-sm leading-5 text-[hsl(var(--muted-foreground))]">{step.description}</p></div>
                        <span className="ml-auto hidden font-mono-ui text-[10px] text-[hsl(var(--muted-foreground)/.65)] sm:block">{String(index + 1).padStart(2, '0')}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <aside className="space-y-5">
                  <div className="cue-panel rounded-2xl p-5 text-[hsl(var(--primary-foreground))]">
                    <p className="font-mono-ui text-[10px] uppercase tracking-[.16em] opacity-70">Your cue</p>
                    <p className="mt-2 font-display text-xl font-semibold">{selected.mnemonic.word}</p>
                    <p className="mt-2 text-sm leading-5 opacity-80">{selected.mnemonic.cue}</p>
                  </div>
                  <div>
                    <h3 className="font-mono-ui text-[10px] font-bold uppercase tracking-[.18em] text-[hsl(var(--muted-foreground))]">When to use it</h3>
                    <p className="mt-2 text-sm leading-6">{selected.howToUse}</p>
                  </div>
                  <div>
                    <h3 className="font-mono-ui text-[10px] font-bold uppercase tracking-[.18em] text-[hsl(var(--muted-foreground))]">Best for</h3>
                    <div className="mt-2 flex flex-wrap gap-1.5">{selected.bestFor.map((item) => <span key={item} className="rounded-full bg-[hsl(var(--muted))] px-2.5 py-1 text-xs">{item}</span>)}</div>
                  </div>
                </aside>
              </div>
              <div className="example-panel mt-8 rounded-2xl border p-5">
                <p className="flex items-center gap-2 font-mono-ui text-[10px] font-bold uppercase tracking-[.18em] text-[hsl(var(--accent-foreground))]"><ChevronRight size={13} /> Try saying</p>
                <p className="mt-3 text-sm leading-7 text-[hsl(var(--foreground))]">{selected.example}</p>
              </div>
              {selected.sourceNote && <p className="mt-5 text-xs leading-5 text-[hsl(var(--muted-foreground))]"><span className="font-semibold">Source note:</span> {selected.sourceNote}</p>}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;