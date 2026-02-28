import React, { useState, useEffect } from 'react';
import { Clock, Trophy, BookOpen, Code, Brain, ChevronRight, Play, BarChart3, Award, CheckCircle, XCircle, RefreshCw } from 'lucide-react';

const PlacementQuizApp = () => {
  const [currentView, setCurrentView] = useState('home');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedDifficulty, setSelectedDifficulty] = useState(null);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [quizQuestions, setQuizQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState({});
  const [quizStartTime, setQuizStartTime] = useState(null);
  const [timeRemaining, setTimeRemaining] = useState(null);
  const [userProgress, setUserProgress] = useState({
    totalQuizzes: 0,
    aptitudeScore: 0,
    dsaScore: 0,
    programmingScore: 0,
    history: []
  });
  const [adaptiveMode, setAdaptiveMode] = useState(false);

  const categories = [
    { id: 'aptitude', name: 'Quantitative Aptitude', icon: Brain, color: 'bg-blue-500' },
    { id: 'dsa', name: 'Data Structures & Algorithms', icon: Code, color: 'bg-green-500' },
    { id: 'programming', name: 'Programming Languages', icon: BookOpen, color: 'bg-purple-500' }
  ];

  const companies = ['TCS', 'Infosys', 'Wipro', 'Amazon', 'Google', 'Microsoft', 'Accenture', 'Cognizant'];

  const getQuestionBank = () => ({
    aptitude: {
      easy: [
        { question: "If 20% of a number is 40, what is the number?", options: ["160", "180", "200", "220"], correct: 2, explanation: "Let x be the number. 20% of x = 40, so 0.2x = 40, x = 200" },
        { question: "A train travels 60 km in 1 hour. How far will it travel in 3.5 hours?", options: ["180 km", "200 km", "210 km", "240 km"], correct: 2, explanation: "Speed = 60 km/hr. Distance = Speed x Time = 60 x 3.5 = 210 km" },
        { question: "What is 15% of 200?", options: ["25", "30", "35", "40"], correct: 1, explanation: "15% of 200 = (15/100) x 200 = 30" },
        { question: "If a product costs Rs 800 after a 20% discount, what was the original price?", options: ["Rs 960", "Rs 1000", "Rs 1040", "Rs 1100"], correct: 1, explanation: "Let original price = x. After 20% discount: 0.8x = 800, x = 1000" },
        { question: "A sum of Rs 10,000 becomes Rs 11,000 in 2 years at simple interest. What is the rate?", options: ["5%", "6%", "4%", "5.5%"], correct: 0, explanation: "SI = 1000, P = 10000, T = 2. Rate = (SI x 100)/(P x T) = 5%" },
        { question: "The average of 5 numbers is 30. If one number is excluded, average becomes 28. What is excluded?", options: ["36", "38", "40", "42"], correct: 1, explanation: "Sum of 5 = 150. Sum of 4 = 112. Excluded = 150 - 112 = 38" },
        { question: "If 3 apples cost Rs 45, how much will 7 apples cost?", options: ["Rs 95", "Rs 100", "Rs 105", "Rs 110"], correct: 2, explanation: "Cost of 1 apple = 45/3 = 15. Cost of 7 = 15 x 7 = 105" },
        { question: "What is the next number: 2, 6, 12, 20, 30, ?", options: ["38", "40", "42", "44"], correct: 2, explanation: "Differences: 4, 6, 8, 10, next is 12. So 30 + 12 = 42" },
        { question: "A bag has 3 red, 4 blue, 5 green balls. Probability of drawing blue?", options: ["1/3", "1/4", "1/2", "5/12"], correct: 0, explanation: "Total = 12. Blue = 4. Probability = 4/12 = 1/3" },
        { question: "If x + 5 = 12, what is 2x?", options: ["10", "12", "14", "16"], correct: 2, explanation: "x = 12 - 5 = 7. Therefore, 2x = 14" },
        { question: "A car travels 240 km in 4 hours. Average speed?", options: ["50 km/h", "55 km/h", "60 km/h", "65 km/h"], correct: 2, explanation: "Speed = Distance/Time = 240/4 = 60 km/h" },
        { question: "What is 25% of 80?", options: ["15", "20", "25", "30"], correct: 1, explanation: "25% of 80 = (25/100) x 80 = 20" },
        { question: "Ratio boys:girls is 3:2. If 15 boys, how many girls?", options: ["8", "10", "12", "15"], correct: 1, explanation: "If 3 parts = 15, then 1 part = 5. Girls = 2 parts = 10" },
        { question: "Item sold for Rs 450 with 20% profit. Cost price?", options: ["Rs 350", "Rs 375", "Rs 400", "Rs 425"], correct: 1, explanation: "SP = 1.2 x CP. So CP = 450/1.2 = 375" },
        { question: "8 men complete task in 12 days. How many days for 6 men?", options: ["14 days", "15 days", "16 days", "18 days"], correct: 2, explanation: "Total work = 8 x 12 = 96 man-days. For 6 men = 96/6 = 16" }
      ],
      medium: [
        { question: "A and B in 12 days. B and C in 15 days. A and C in 20 days. All together?", options: ["8 days", "10 days", "12 days", "15 days"], correct: 1, explanation: "Using work formula gives 10 days" },
        { question: "Train 150m long passes pole in 15 sec. Speed in km/h?", options: ["32 km/h", "36 km/h", "40 km/h", "45 km/h"], correct: 1, explanation: "Speed = 150/15 = 10 m/s = 36 km/h" },
        { question: "Father and son ages sum to 45. After 5 years, father is 4 times son. Son's age?", options: ["5 years", "7 years", "8 years", "10 years"], correct: 0, explanation: "Solving equations gives son = 5 years" },
        { question: "Cistern filled by two pipes in 20 and 30 min. Together?", options: ["10 min", "12 min", "15 min", "18 min"], correct: 1, explanation: "Combined rate = 1/20 + 1/30 = 1/12. Time = 12 min" },
        { question: "Mixture milk:water 5:3. Add 16L water, ratio 5:5. Find milk quantity?", options: ["30 L", "35 L", "40 L", "45 L"], correct: 2, explanation: "Solving gives milk = 40 liters" },
        { question: "CI on Rs 10,000 for 2 years at 10% p.a.?", options: ["Rs 11,000", "Rs 11,500", "Rs 12,000", "Rs 12,100"], correct: 3, explanation: "Amount = 10000 x 1.1 x 1.1 = 12,100" },
        { question: "Average of 8 people increases by 2.5 kg when new person replaces 65 kg. New weight?", options: ["75 kg", "80 kg", "85 kg", "90 kg"], correct: 2, explanation: "Increase = 8 x 2.5 = 20. New = 65 + 20 = 85 kg" },
        { question: "Boat 20 km upstream in 4h, downstream in 2h. Stream speed?", options: ["2.5 km/h", "3 km/h", "3.5 km/h", "4 km/h"], correct: 0, explanation: "Up = 5 km/h, Down = 10. Stream = (10-5)/2 = 2.5" },
        { question: "5 people seated in row - how many ways?", options: ["60", "100", "120", "150"], correct: 2, explanation: "5! = 120 arrangements" },
        { question: "Sum becomes 3 times in 10 years SI. Rate?", options: ["15%", "18%", "20%", "25%"], correct: 2, explanation: "SI = 2P. Rate = (2P x 100)/(P x 10) = 20%" },
        { question: "Square diagonal 10 root-2 cm. Perimeter?", options: ["30 cm", "35 cm", "40 cm", "45 cm"], correct: 2, explanation: "Side = 10 cm. Perimeter = 40 cm" },
        { question: "A does work in 15 days. B is 50% more efficient. B's time?", options: ["8 days", "9 days", "10 days", "12 days"], correct: 2, explanation: "B time = 15/1.5 = 10 days" },
        { question: "Price +25% then -20%. Net change?", options: ["0%", "5% decrease", "5% increase", "10% decrease"], correct: 0, explanation: "1.25 x 0.8 = 1. No change" },
        { question: "Train crosses platform 200m in 30s, pole in 10s. Train length?", options: ["100m", "120m", "150m", "200m"], correct: 0, explanation: "Speed from pole = L/10. Platform gives L=100m" },
        { question: "Probability of getting sum 7 with two dice?", options: ["1/6", "1/5", "1/4", "1/3"], correct: 0, explanation: "6 ways out of 36: (1,6), (2,5), (3,4), (4,3), (5,2), (6,1) = 6/36 = 1/6" }
      ],
      hard: [
        { question: "Letters of EXAMINATION arranged how many ways?", options: ["19,958,400", "39,916,800", "4,989,600", "9,979,200"], correct: 2, explanation: "11!/(2! x 2! x 2!) = 4,989,600" },
        { question: "Number: div by 6 rem 3, by 5 rem 2, by 4 rem 1. Smallest?", options: ["57", "93", "117", "177"], correct: 0, explanation: "Systematic checking gives 57" },
        { question: "Product 120, HCF 4. How many pairs?", options: ["1", "2", "3", "4"], correct: 1, explanation: "Two valid pairs exist" },
        { question: "CI doubles in 4 years. When 16 times?", options: ["12 years", "14 years", "16 years", "18 years"], correct: 2, explanation: "Doubles every 4y: 2,4,8,16 = 16 years" },
        { question: "Select 3 from 10 with 1 person always included?", options: ["36", "45", "84", "120"], correct: 0, explanation: "9C2 = 36 ways" },
        { question: "Clock gains 5 min/hour. Set at 12 noon, shows what at 3 PM?", options: ["3:15 PM", "3:20 PM", "3:25 PM", "3:30 PM"], correct: 0, explanation: "3h gain = 15 min. Shows 3:15" },
        { question: "Avg 11 numbers 50. First 6 avg 48, last 6 avg 53. 6th number?", options: ["52", "54", "56", "58"], correct: 2, explanation: "Total calculations give 56" },
        { question: "Wheel 1000 revolutions covers 44 km. Radius?", options: ["5 m", "6 m", "7 m", "8 m"], correct: 2, explanation: "Circumference = 44m, radius = 7m" },
        { question: "P(A solves) = 1/3, P(B) = 2/5. P(problem solved)?", options: ["3/5", "8/15", "11/15", "13/15"], correct: 2, explanation: "1 - P(both fail) = 1 - (2/3)(3/5) = 11/15" },
        { question: "How many 4-digit numbers divisible by 5 can be formed using 0-9 without repetition?", options: ["952", "1024", "1512", "2016"], correct: 2, explanation: "Last digit 0 or 5. Cases: 0 at end = 9x8x7, 5 at end = 8x8x7 = 504+1008=1512" }
      ]
    },
    dsa: {
      easy: [
        { question: "Time complexity of array access by index?", options: ["O(1)", "O(n)", "O(log n)", "O(n squared)"], correct: 0, explanation: "Direct access is O(1)" },
        { question: "Which uses LIFO?", options: ["Queue", "Stack", "Array", "Linked List"], correct: 1, explanation: "Stack is Last In First Out" },
        { question: "Insert at beginning of linked list time?", options: ["O(1)", "O(n)", "O(log n)", "O(n squared)"], correct: 0, explanation: "Update head pointer only - O(1)" },
        { question: "NOT comparison-based sorting?", options: ["Bubble Sort", "Merge Sort", "Counting Sort", "Quick Sort"], correct: 2, explanation: "Counting Sort uses counting array" },
        { question: "Max nodes at level L in binary tree?", options: ["2 to power L", "2 to power L-1", "2 to power L+1", "L squared"], correct: 0, explanation: "Level L has 2^L nodes max" },
        { question: "FIFO data structure?", options: ["Stack", "Queue", "Tree", "Graph"], correct: 1, explanation: "Queue is First In First Out" },
        { question: "Space complexity of factorial recursion?", options: ["O(1)", "O(n)", "O(log n)", "O(n squared)"], correct: 1, explanation: "Recursion stack depth n" },
        { question: "NOT supported in stack?", options: ["Push", "Pop", "Peek", "Random Access"], correct: 3, explanation: "Stack only accesses top" },
        { question: "Linear search worst case?", options: ["O(1)", "O(n)", "O(log n)", "O(n log n)"], correct: 1, explanation: "May check all n elements" },
        { question: "BST minimum value location?", options: ["Root", "Leftmost node", "Rightmost node", "Any leaf"], correct: 1, explanation: "Leftmost has minimum" },
        { question: "Best for LRU cache?", options: ["Array", "Stack", "HashMap and DLL", "Binary Tree"], correct: 2, explanation: "HashMap and Doubly Linked List" },
        { question: "Binary search complexity?", options: ["O(1)", "O(n)", "O(log n)", "O(n log n)"], correct: 2, explanation: "Halves search space - O(log n)" },
        { question: "BST traversal for sorted order?", options: ["Preorder", "Inorder", "Postorder", "Level Order"], correct: 1, explanation: "Inorder gives sorted sequence" },
        { question: "Balanced binary tree max height with n nodes?", options: ["log n", "n", "n/2", "square root n"], correct: 0, explanation: "Balanced maintains O(log n)" },
        { question: "What is a tree in graphs?", options: ["Connected with cycles", "Disconnected acyclic", "Connected acyclic", "Complete graph"], correct: 2, explanation: "Connected graph, no cycles" }
      ],
      medium: [
        { question: "Quick Sort worst case?", options: ["O(n)", "O(n log n)", "O(n squared)", "O(log n)"], correct: 2, explanation: "Poor pivot gives O(n squared)" },
        { question: "Quick Select average for kth element?", options: ["O(k)", "O(n)", "O(n log n)", "O(n squared)"], correct: 1, explanation: "Average O(n) for kth" },
        { question: "Hash table chaining worst search?", options: ["O(1)", "O(log n)", "O(n)", "O(n squared)"], correct: 2, explanation: "All in one bucket - O(n)" },
        { question: "Min edges for n vertex connected graph?", options: ["n", "n-1", "n+1", "n squared"], correct: 1, explanation: "Tree has n-1 edges" },
        { question: "Shortest path with negative edges?", options: ["Dijkstra's", "Bellman-Ford", "Floyd-Warshall", "Prim's"], correct: 1, explanation: "Bellman-Ford handles negatives" },
        { question: "Merge Sort space?", options: ["O(1)", "O(log n)", "O(n)", "O(n log n)"], correct: 2, explanation: "Needs O(n) for merging" },
        { question: "Max heap find minimum time?", options: ["O(1)", "O(log n)", "O(n)", "O(n log n)"], correct: 2, explanation: "Check all leaves - O(n)" },
        { question: "Directed graph cycle detection?", options: ["O(V)", "O(E)", "O(V + E)", "O(V times E)"], correct: 2, explanation: "DFS takes O(V + E)" },
        { question: "Stable sorting algorithm?", options: ["Quick Sort", "Heap Sort", "Merge Sort", "Selection Sort"], correct: 2, explanation: "Merge Sort is stable" },
        { question: "Build heap from n elements?", options: ["O(n)", "O(n log n)", "O(n squared)", "O(log n)"], correct: 0, explanation: "Bottom-up heapify is O(n)" },
        { question: "What is memoization?", options: ["Bottom-up", "Top-down caching", "Greedy", "Divide conquer"], correct: 1, explanation: "Top-down DP with caching" },
        { question: "DFS graph complexity?", options: ["O(V)", "O(E)", "O(V + E)", "O(V times E)"], correct: 2, explanation: "Visits all vertices and edges" },
        { question: "BFS uses which structure?", options: ["Stack", "Queue", "Heap", "Hash Table"], correct: 1, explanation: "BFS uses queue for FIFO" },
        { question: "AVL tree n insertions average?", options: ["O(n)", "O(n log n)", "O(n squared)", "O(log n)"], correct: 1, explanation: "Each O(log n), total O(n log n)" },
        { question: "Kruskal's cycle detection uses?", options: ["Stack", "Queue", "Union-Find", "Heap"], correct: 2, explanation: "Disjoint Set Union" }
      ],
      hard: [
        { question: "Floyd-Warshall complexity?", options: ["O(V squared)", "O(V cubed)", "O(V squared log V)", "O(VE)"], correct: 1, explanation: "Three nested loops - O(V cubed)" },
        { question: "0/1 knapsack DP space?", options: ["O(n)", "O(W)", "O(nW)", "O(n squared)"], correct: 2, explanation: "Table size n times W" },
        { question: "Max edges in simple directed n-vertex graph?", options: ["n(n-1)/2", "n(n-1)", "n squared", "2n"], correct: 1, explanation: "Every vertex to others - n(n-1)" },
        { question: "Stack operations amortized cost?", options: ["O(1)", "O(log n)", "O(n)", "Depends"], correct: 0, explanation: "O(1) amortized per op" },
        { question: "Comparison sort lower bound?", options: ["O(n)", "O(n log n)", "O(n squared)", "O(log n)"], correct: 1, explanation: "Proven Omega(n log n) minimum" },
        { question: "Tarjan's SCC worst case?", options: ["O(V)", "O(E)", "O(V + E)", "O(V squared)"], correct: 2, explanation: "DFS-based O(V + E)" },
        { question: "Huffman coding optimal property?", options: ["Greedy", "Frequency order", "Binary tree", "All of above"], correct: 3, explanation: "All properties apply" },
        { question: "B-tree order m, min keys in non-root?", options: ["m/2", "ceil(m/2)", "ceil(m/2) - 1", "m - 1"], correct: 2, explanation: "ceil(m/2) - 1 minimum" },
        { question: "Topological sort only for?", options: ["Any graph", "Directed Acyclic Graph", "Undirected graph", "Complete graph"], correct: 1, explanation: "Only DAGs have topological order" },
        { question: "Red-Black tree max height with n nodes?", options: ["log n", "2 log n", "n", "square root n"], correct: 1, explanation: "Height bounded by 2 log(n+1)" }
      ]
    },
    programming: {
      easy: [
        { question: "NOT a pillar of OOP?", options: ["Encapsulation", "Inheritance", "Compilation", "Polymorphism"], correct: 2, explanation: "Four pillars exclude Compilation" },
        { question: "Output of print(type([]))?", options: ["class list", "class array", "class tuple", "Error"], correct: 0, explanation: "[] is a list type" },
        { question: "Add element to list end?", options: ["add()", "append()", "insert()", "push()"], correct: 1, explanation: "append() adds to end" },
        { question: "Default function return in Python?", options: ["None", "0", "null", "void"], correct: 0, explanation: "Returns None by default" },
        { question: "Valid Python variable name?", options: ["2variable", "variable_2", "variable-2", "variable 2"], correct: 1, explanation: "Can use underscore, not start with digit" },
        { question: "Java access only within class?", options: ["public", "private", "protected", "default"], correct: 1, explanation: "private restricts to class" },
        { question: "Output of print(5 // 2)?", options: ["2", "2.5", "3", "Error"], correct: 0, explanation: "Floor division gives 2" },
        { question: "Loop executes at least once?", options: ["for", "while", "do-while", "None"], correct: 2, explanation: "do-while checks after execution" },
        { question: "C++ int size on 32-bit?", options: ["2 bytes", "4 bytes", "8 bytes", "Compiler dependent"], correct: 1, explanation: "Typically 4 bytes" },
        { question: "SQL stands for?", options: ["Structured Query Language", "Simple Query", "System Query", "Standard Query"], correct: 0, explanation: "Structured Query Language" },
        { question: "Python exception handling keyword?", options: ["catch", "except", "handle", "error"], correct: 1, explanation: "except catches exceptions" },
        { question: "Java collection maintains insertion order?", options: ["HashSet", "TreeSet", "LinkedHashSet", "All"], correct: 2, explanation: "LinkedHashSet keeps order" },
        { question: "Output of bool(0)?", options: ["True", "False", "0", "Error"], correct: 1, explanation: "0 converts to False" },
        { question: "Java string concatenation operator?", options: ["&", "+", ".", "||"], correct: 1, explanation: "+ concatenates strings" },
        { question: "C++ output for Hello?", options: ["print", "echo", "cout", "System.out"], correct: 2, explanation: "cout for output" }
      ],
      medium: [
        { question: "Java prevent method override?", options: ["static", "final", "abstract", "private"], correct: 1, explanation: "final prevents overriding" },
        { question: "Python lambda function?", options: ["Named", "Anonymous", "Class method", "Built-in"], correct: 1, explanation: "Lambda is anonymous" },
        { question: "C++ struct vs class difference?", options: ["None", "Default access", "No methods in struct", "No public in class"], correct: 1, explanation: "struct public, class private default" },
        { question: "What is method overloading?", options: ["Same name diff params", "Diff name same params", "Redefine parent", "Call multiple"], correct: 0, explanation: "Same name with different parameters" },
        { question: "List vs tuple in Python?", options: ["None", "List mutable tuple immutable", "Tuple faster", "List less memory"], correct: 1, explanation: "Mutability difference" },
        { question: "Java super keyword does?", options: ["Creates superclass", "Calls parent", "Makes abstract", "Prevents inherit"], correct: 1, explanation: "Calls parent class members" },
        { question: "SQL filter groups clause?", options: ["WHERE", "FILTER", "HAVING", "GROUP BY"], correct: 2, explanation: "HAVING filters after GROUP BY" },
        { question: "Python decorator is?", options: ["Design pattern", "Modifies function", "Data type", "Loop"], correct: 1, explanation: "Function that modifies functions" },
        { question: "What is polymorphism?", options: ["Multiple inheritance", "Many forms", "Private methods", "Static typing"], correct: 1, explanation: "Objects take many forms" },
        { question: "SQL foreign key?", options: ["Primary key in another table", "Key from another country", "Encrypted key", "Backup key"], correct: 0, explanation: "References another table's primary key" },
        { question: "Purpose of __init__ in Python?", options: ["Initializes module", "Constructor method", "Destructor method", "Main function"], correct: 1, explanation: "__init__ is constructor" },
        { question: "Java == vs .equals()?", options: ["No difference", "== refs .equals() content", "== faster", ".equals() deprecated"], correct: 1, explanation: "== compares references, .equals() compares content" },
        { question: "What is encapsulation?", options: ["Hiding data", "Inheritance", "Polymorphism", "Abstraction"], correct: 0, explanation: "Hiding internal details and data" },
        { question: "Python list comprehension?", options: ["Compressing lists", "Concise way to create lists", "Comparing lists", "Sorting lists"], correct: 1, explanation: "Compact syntax for creating lists" },
        { question: "C++ virtual function purpose?", options: ["Static binding", "Dynamic binding", "Prevents override", "Inline function"], correct: 1, explanation: "Enables runtime polymorphism" }
      ],
      hard: [
        { question: "Python == vs is?", options: ["No difference", "== values is identity", "is values == identity", "Both compare types"], correct: 1, explanation: "== checks values, is checks same object" },
        { question: "C++ diamond problem?", options: ["Memory leak", "Multiple inheritance ambiguity", "Pointer deref", "Template error"], correct: 1, explanation: "Multiple inheritance from common base" },
        { question: "What is a closure?", options: ["Ending program", "Function with outer scope access", "Loop termination", "Class destructor"], correct: 1, explanation: "Function retains access to outer scope" },
        { question: "Java volatile keyword?", options: ["Prevents modification", "Ensures thread visibility", "Makes constant", "Speeds access"], correct: 1, explanation: "Ensures visibility across threads" },
        { question: "Python monkey patching?", options: ["Bug fixing", "Dynamic class modification", "Testing technique", "Code optimization"], correct: 1, explanation: "Dynamically modifying classes at runtime" },
        { question: "C++ move semantics?", options: ["Moving files", "Efficient resource transfer", "Object relocation", "Pointer arithmetic"], correct: 1, explanation: "Efficient transfer without copying" },
        { question: "Deep vs shallow copy?", options: ["No difference", "Deep copies nested shallow doesnt", "Deep slower", "Shallow more memory"], correct: 1, explanation: "Deep copies nested objects, shallow doesn't" },
        { question: "Python GIL?", options: ["Security feature", "Mutex for one thread", "Import system", "Memory manager"], correct: 1, explanation: "Allows only one thread to execute bytecode" },
        { question: "Tail recursion optimization?", options: ["Removing last call", "Converting to loops", "Optimizing loop tails", "Removing base"], correct: 1, explanation: "Converts tail-recursive calls to iterative loops" },
        { question: "Java Comparable vs Comparator?", options: ["No difference", "Comparable internal Comparator external", "Comparable faster", "Comparator deprecated"], correct: 1, explanation: "Comparable defines natural ordering, Comparator provides external comparison" }
      ]
    }
  });

  const generateQuiz = () => {
    const bank = getQuestionBank();
    const difficulty = selectedDifficulty || 'easy';
    const category = selectedCategory;
    let questions = [...bank[category][difficulty]];
    
    const otherDifficulties = ['easy', 'medium', 'hard'].filter(d => d !== difficulty);
    otherDifficulties.forEach(d => {
      if (bank[category][d]) {
        questions = [...questions, ...bank[category][d]];
      }
    });

    const shuffled = questions.sort(() => Math.random() - 0.5).slice(0, 10);
    setQuizQuestions(shuffled);
    setCurrentQuestionIndex(0);
    setUserAnswers({});
    setQuizStartTime(Date.now());
    setTimeRemaining(600);
    setCurrentView('quiz');
  };

  useEffect(() => {
    if (currentView === 'quiz' && timeRemaining > 0) {
      const timer = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            submitQuiz();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [currentView, timeRemaining]);

  const handleAnswer = (questionIndex, answerIndex) => {
    setUserAnswers(prev => ({
      ...prev,
      [questionIndex]: answerIndex
    }));
  };

  const submitQuiz = () => {
    let correct = 0;
    quizQuestions.forEach((q, idx) => {
      if (userAnswers[idx] === q.correct) correct++;
    });

    const score = (correct / quizQuestions.length) * 100;
    const timeTaken = Math.floor((Date.now() - quizStartTime) / 1000);

    const newHistory = {
      date: new Date().toLocaleDateString(),
      category: selectedCategory,
      difficulty: selectedDifficulty,
      score: score,
      timeTaken: timeTaken,
      questionsAttempted: Object.keys(userAnswers).length
    };

    setUserProgress(prev => ({
      ...prev,
      totalQuizzes: prev.totalQuizzes + 1,
      [`${selectedCategory}Score`]: score,
      history: [newHistory, ...prev.history.slice(0, 9)]
    }));

    setCurrentView('results');
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const renderHome = () => (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <Trophy className="w-16 h-16 text-indigo-600" />
          </div>
          <h1 className="text-5xl font-bold text-gray-900 mb-4">Placement Quiz Generator</h1>
          <p className="text-xl text-gray-600">Master your placement preparation with practice quizzes</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {categories.map(cat => (
            <div
              key={cat.id}
              onClick={() => {
                setSelectedCategory(cat.id);
                setCurrentView('setup');
              }}
              className="bg-white rounded-xl shadow-lg p-6 cursor-pointer transform transition hover:scale-105 hover:shadow-xl"
            >
              <div className={`${cat.color} w-16 h-16 rounded-lg flex items-center justify-center mb-4`}>
                <cat.icon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">{cat.name}</h3>
              <p className="text-gray-600 mb-4">Practice {cat.id} questions</p>
              <div className="flex items-center text-indigo-600 font-semibold">
                Start Quiz <ChevronRight className="w-5 h-5 ml-1" />
              </div>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
            <BarChart3 className="w-6 h-6 mr-2 text-indigo-600" />
            Your Progress
          </h2>
          <div className="grid md:grid-cols-4 gap-6">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-3xl font-bold text-blue-600">{userProgress.totalQuizzes}</div>
              <div className="text-gray-600 mt-1">Total Quizzes</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-3xl font-bold text-green-600">{userProgress.aptitudeScore.toFixed(0)}%</div>
              <div className="text-gray-600 mt-1">Aptitude</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-3xl font-bold text-purple-600">{userProgress.dsaScore.toFixed(0)}%</div>
              <div className="text-gray-600 mt-1">DSA</div>
            </div>
            <div className="text-center p-4 bg-orange-50 rounded-lg">
              <div className="text-3xl font-bold text-orange-600">{userProgress.programmingScore.toFixed(0)}%</div>
              <div className="text-gray-600 mt-1">Programming</div>
            </div>
          </div>
        </div>

        {userProgress.history.length > 0 && (
          <div className="bg-white rounded-xl shadow-lg p-8 mt-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Recent Activity</h2>
            <div className="space-y-3">
              {userProgress.history.slice(0, 5).map((item, idx) => (
                <div key={idx} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-4">
                    <Award className="w-5 h-5 text-indigo-600" />
                    <div>
                      <div className="font-semibold text-gray-900 capitalize">{item.category} - {item.difficulty}</div>
                      <div className="text-sm text-gray-600">{item.date}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-indigo-600">{item.score.toFixed(0)}%</div>
                    <div className="text-sm text-gray-600">{formatTime(item.timeTaken)}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );

  const renderSetup = () => (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <button
          onClick={() => setCurrentView('home')}
          className="mb-6 text-indigo-600 hover:text-indigo-700 font-semibold"
        >
          ← Back to Home
        </button>

        <div className="bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 capitalize">
            Setup Your {selectedCategory} Quiz
          </h2>

          <div className="space-y-8">
            <div>
              <label className="block text-lg font-semibold text-gray-900 mb-4">
                Select Difficulty Level
              </label>
              <div className="grid grid-cols-3 gap-4">
                {['easy', 'medium', 'hard'].map(diff => (
                  <button
                    key={diff}
                    onClick={() => setSelectedDifficulty(diff)}
                    className={`p-4 rounded-lg border-2 font-semibold capitalize transition ${
                      selectedDifficulty === diff
                        ? 'border-indigo-600 bg-indigo-50 text-indigo-600'
                        : 'border-gray-200 hover:border-indigo-300'
                    }`}
                  >
                    {diff}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="flex items-center gap-3 p-4 bg-purple-50 rounded-lg cursor-pointer">
                <input
                  type="checkbox"
                  checked={adaptiveMode}
                  onChange={(e) => setAdaptiveMode(e.target.checked)}
                  className="w-5 h-5 text-indigo-600"
                />
                <div>
                  <div className="font-semibold text-gray-900">Adaptive Mode</div>
                  <div className="text-sm text-gray-600">Difficulty adjusts based on your performance</div>
                </div>
              </label>
            </div>

            <div>
              <label className="block text-lg font-semibold text-gray-900 mb-4">
                Company-Specific (Optional)
              </label>
              <select
                value={selectedCompany || ''}
                onChange={(e) => setSelectedCompany(e.target.value || null)}
                className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-indigo-600 focus:outline-none"
              >
                <option value="">All Companies</option>
                {companies.map(comp => (
                  <option key={comp} value={comp}>{comp}</option>
                ))}
              </select>
            </div>

            <button
              onClick={generateQuiz}
              disabled={!selectedDifficulty}
              className="w-full bg-indigo-600 text-white py-4 rounded-lg font-bold text-lg hover:bg-indigo-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition flex items-center justify-center gap-2"
            >
              <Play className="w-6 h-6" />
              Start Quiz (10 Questions)
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderQuiz = () => {
    const currentQuestion = quizQuestions[currentQuestionIndex];

    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="text-sm font-semibold text-gray-600">
                  Question {currentQuestionIndex + 1} of {quizQuestions.length}
                </div>
                <div className="h-2 w-64 bg-gray-200 rounded-full">
                  <div
                    className="h-full bg-indigo-600 rounded-full transition-all"
                    style={{ width: `${((currentQuestionIndex + 1) / quizQuestions.length) * 100}%` }}
                  />
                </div>
              </div>
              <div className="flex items-center gap-2 text-orange-600 font-bold">
                <Clock className="w-5 h-5" />
                {formatTime(timeRemaining)}
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-8 mb-6">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">
              {currentQuestion.question}
            </h3>

            <div className="space-y-3">
              {currentQuestion.options.map((option, idx) => (
                <button
                  key={idx}
                  onClick={() => handleAnswer(currentQuestionIndex, idx)}
                  className={`w-full p-4 text-left rounded-lg border-2 transition ${
                    userAnswers[currentQuestionIndex] === idx
                      ? 'border-indigo-600 bg-indigo-50'
                      : 'border-gray-200 hover:border-indigo-300'
                  }`}
                >
                  <span className="font-semibold mr-3">{String.fromCharCode(65 + idx)}.</span>
                  {option}
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-4">
            <button
              onClick={() => setCurrentQuestionIndex(prev => Math.max(0, prev - 1))}
              disabled={currentQuestionIndex === 0}
              className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            
            {currentQuestionIndex < quizQuestions.length - 1 ? (
              <button
                onClick={() => setCurrentQuestionIndex(prev => prev + 1)}
                className="flex-1 px-6 py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700"
              >
                Next Question
              </button>
            ) : (
              <button
                onClick={submitQuiz}
                className="flex-1 px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700"
              >
                Submit Quiz
              </button>
            )}
          </div>
        </div>
      </div>
    );
  };

  const renderResults = () => {
    const correct = quizQuestions.filter((q, idx) => userAnswers[idx] === q.correct).length;
    const score = (correct / quizQuestions.length) * 100;
    const timeTaken = Math.floor((Date.now() - quizStartTime) / 1000);

    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 py-12">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-white rounded-xl shadow-lg p-8 mb-6">
            <div className="text-center mb-8">
              <Trophy className="w-20 h-20 text-yellow-500 mx-auto mb-4" />
              <h2 className="text-4xl font-bold text-gray-900 mb-2">Quiz Completed!</h2>
              <p className="text-gray-600">Here's how you performed</p>
            </div>

            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <div className="text-center p-6 bg-green-50 rounded-lg">
                <div className="text-4xl font-bold text-green-600">{score.toFixed(0)}%</div>
                <div className="text-gray-600 mt-1">Score</div>
              </div>
              <div className="text-center p-6 bg-blue-50 rounded-lg">
                <div className="text-4xl font-bold text-blue-600">{correct}/{quizQuestions.length}</div>
                <div className="text-gray-600 mt-1">Correct</div>
              </div>
              <div className="text-center p-6 bg-purple-50 rounded-lg">
                <div className="text-4xl font-bold text-purple-600">{formatTime(timeTaken)}</div>
                <div className="text-gray-600 mt-1">Time Taken</div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-xl font-bold text-gray-900">Answer Review</h3>
              {quizQuestions.map((q, idx) => {
                const isCorrect = userAnswers[idx] === q.correct;
                return (
                  <div key={idx} className="border-2 border-gray-200 rounded-lg p-4">
                    <div className="flex items-start gap-3 mb-3">
                      {isCorrect ? (
                        <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                      ) : (
                        <XCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-1" />
                      )}
                      <div className="flex-1">
                        <p className="font-semibold text-gray-900 mb-2">{q.question}</p>
                        <p className="text-sm text-gray-600 mb-1">
                          <span className="font-semibold">Your answer:</span>{' '}
                          {userAnswers[idx] !== undefined ? q.options[userAnswers[idx]] : 'Not attempted'}
                        </p>
                        {!isCorrect && (
                          <p className="text-sm text-green-600 mb-1">
                            <span className="font-semibold">Correct answer:</span> {q.options[q.correct]}
                          </p>
                        )}
                        <p className="text-sm text-gray-600 italic">{q.explanation}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="flex gap-4 mt-8">
              <button
                onClick={() => {
                  setCurrentView('home');
                  setSelectedCategory(null);
                  setSelectedDifficulty(null);
                }}
                className="flex-1 px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300"
              >
                Back to Home
              </button>
              <button
                onClick={generateQuiz}
                className="flex-1 px-6 py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 flex items-center justify-center gap-2"
              >
                <RefreshCw className="w-5 h-5" />
                Retry Quiz
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div>
      {currentView === 'home' && renderHome()}
      {currentView === 'setup' && renderSetup()}
      {currentView === 'quiz' && renderQuiz()}
      {currentView === 'results' && renderResults()}
    </div>
  );
};

export default PlacementQuizApp;