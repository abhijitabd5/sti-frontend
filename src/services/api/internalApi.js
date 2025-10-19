import MOCK_DATA from '@/mockData/mockData';

// Extended mock data for internal course management
const INTERNAL_COURSES = [
  {
    id: 1,
    title: "Basic Excavator Operation",
    slug: "basic-excavator-operation",
    language: "en",
    summary: "Learn fundamental excavator operation skills and safety procedures with hands-on training",
    description: "This comprehensive course covers all aspects of excavator operation from basic controls to advanced techniques. Students will learn safety protocols, maintenance procedures, and operational best practices through both classroom instruction and hands-on training with real equipment.",
    duration: 4, // weeks
    syllabus_text: "Week 1: Introduction to excavators and safety protocols\nWeek 2: Basic operation and controls\nWeek 3: Advanced techniques and applications\nWeek 4: Maintenance and troubleshooting",
    syllabus_file_path: "/uploads/syllabus/excavator-basic.pdf",
    original_fee: 2500,
    is_discounted: true,
    discounted_fee: 2200,
    discount_percentage: 12,
    show_offer_badge: true,
    offer_badge_text: "Early Bird Special",
    thumbnail: "/api/placeholder/400/300",
    display_order: 1,
    status: "active",
    created_at: "2024-01-15",
    updated_at: "2024-08-20"
  },
  {
    id: 2,
    title: "Advanced Heavy Equipment",
    slug: "advanced-heavy-equipment",
    language: "en",
    summary: "Master multiple heavy equipment types including bulldozers and cranes",
    description: "An intensive program designed for experienced operators looking to expand their skills across multiple equipment types. This course covers bulldozers, cranes, loaders, and advanced operational techniques used in large-scale construction projects.",
    duration: 8, // weeks
    syllabus_text: "Weeks 1-2: Multi-equipment overview and safety\nWeeks 3-4: Bulldozer operations\nWeeks 5-6: Crane operations\nWeeks 7-8: Advanced project management",
    syllabus_file_path: "/uploads/syllabus/advanced-heavy-equipment.pdf",
    original_fee: 4500,
    is_discounted: false,
    discounted_fee: null,
    discount_percentage: 0,
    show_offer_badge: false,
    offer_badge_text: "",
    thumbnail: "/api/placeholder/400/300",
    display_order: 2,
    status: "active",
    created_at: "2024-01-20",
    updated_at: "2024-08-15"
  },
  {
    id: 3,
    title: "Crane Operator Certification",
    slug: "crane-operator-certification",
    language: "en",
    summary: "Specialized crane operation training with industry certification",
    description: "Get certified to operate tower cranes, mobile cranes, and overhead cranes. This course meets all OSHA requirements and includes both written and practical examinations for industry certification.",
    duration: 6, // weeks
    syllabus_text: "Weeks 1-2: Crane types and safety regulations\nWeeks 3-4: Practical operation training\nWeeks 5-6: Advanced techniques and certification prep",
    syllabus_file_path: "/uploads/syllabus/crane-certification.pdf",
    original_fee: 3800,
    is_discounted: true,
    discounted_fee: 3400,
    discount_percentage: 11,
    show_offer_badge: true,
    offer_badge_text: "Limited Time",
    thumbnail: "/api/placeholder/400/300",
    display_order: 3,
    status: "active",
    created_at: "2024-02-01",
    updated_at: "2024-08-10"
  },
  {
    id: 4,
    title: "Bulldozer Operations",
    slug: "bulldozer-operations",
    language: "en",
    summary: "Complete bulldozer operation course with earthmoving techniques",
    description: "Master the art of bulldozer operation with comprehensive training in earthmoving, grading, and site preparation. Learn proper techniques for maximum efficiency and safety in construction and mining operations.",
    duration: 5, // weeks
    syllabus_text: "Week 1: Bulldozer basics and safety\nWeek 2: Operating controls and techniques\nWeek 3: Earthmoving and grading\nWeek 4: Site preparation methods\nWeek 5: Advanced applications",
    syllabus_file_path: "/uploads/syllabus/bulldozer-operations.pdf",
    original_fee: 3200,
    is_discounted: false,
    discounted_fee: null,
    discount_percentage: 0,
    show_offer_badge: false,
    offer_badge_text: "",
    thumbnail: "/api/placeholder/400/300",
    display_order: 4,
    status: "inactive",
    created_at: "2024-02-10",
    updated_at: "2024-08-05"
  },
  {
    id: 5,
    title: "Loader Operation Training",
    slug: "loader-operation-training",
    language: "en",
    summary: "Comprehensive wheel and track loader operation training",
    description: "Learn to operate both wheel loaders and track loaders effectively. This course covers material handling, loading techniques, and operational safety for construction and industrial applications.",
    duration: 3, // weeks
    syllabus_text: "Week 1: Loader types and controls\nWeek 2: Material handling techniques\nWeek 3: Safety protocols and maintenance",
    syllabus_file_path: "/uploads/syllabus/loader-training.pdf",
    original_fee: 2200,
    is_discounted: true,
    discounted_fee: 1980,
    discount_percentage: 10,
    show_offer_badge: true,
    offer_badge_text: "Popular Choice",
    thumbnail: "/api/placeholder/400/300",
    display_order: 5,
    status: "active",
    created_at: "2024-02-15",
    updated_at: "2024-08-12"
  }
];

// Mock transactions data
const TRANSACTIONS = [
  {
    id: 1,
    type: "income",
    category_id: 1,
    category_name: "Course Enrollment Fees",
    amount: 2500.00,
    transaction_date: "2024-08-25",
    payment_mode: "UPI",
    payer_name: "John Smith",
    payer_contact: "+1-555-0123",
    payer_bank_name: "",
    payer_account_number: "",
    payer_upi_id: "john.smith@okaxis",
    payment_ref_number: "TXN202408251234",
    attachment_path: "",
    description: "Payment for Basic Excavator Operation course enrollment",
    created_by: "admin",
    created_at: "2024-08-25T14:30:00Z",
    updated_at: "2024-08-25T14:30:00Z"
  },
  {
    id: 2,
    type: "income",
    category_id: 2,
    category_name: "Certificate Fees",
    amount: 150.00,
    transaction_date: "2024-08-24",
    payment_mode: "Online",
    payer_name: "Sarah Johnson",
    payer_contact: "sarah.j@email.com",
    payer_bank_name: "Chase Bank",
    payer_account_number: "****5678",
    payer_upi_id: "",
    payment_ref_number: "CERT_2024_0824_001",
    attachment_path: "/uploads/transactions/receipt_001.pdf",
    description: "Certificate issuance fee for completed Crane Operator Certification course",
    created_by: "admin",
    created_at: "2024-08-24T09:15:00Z",
    updated_at: "2024-08-24T09:15:00Z"
  },
  {
    id: 3,
    type: "expense",
    category_id: 3,
    category_name: "Equipment Maintenance",
    amount: 850.00,
    transaction_date: "2024-08-23",
    payment_mode: "Cheque",
    receiver_name: "Heavy Equipment Services Ltd",
    receiver_contact: "+1-555-0987",
    receiver_bank_name: "Wells Fargo",
    receiver_account_number: "****9876",
    receiver_upi_id: "",
    payment_ref_number: "CHQ_001234",
    attachment_path: "/uploads/transactions/maintenance_invoice.pdf",
    description: "Monthly maintenance service for excavator equipment including hydraulic system check, oil change, and general inspection",
    created_by: "manager",
    created_at: "2024-08-23T11:45:00Z",
    updated_at: "2024-08-23T11:45:00Z"
  },
  {
    id: 4,
    type: "expense",
    category_id: 4,
    category_name: "Instructor Salaries",
    amount: 3200.00,
    transaction_date: "2024-08-22",
    payment_mode: "Bank",
    receiver_name: "Michael Rodriguez",
    receiver_contact: "michael.r@sti.com",
    receiver_bank_name: "Bank of America",
    receiver_account_number: "****3456",
    receiver_upi_id: "",
    payment_ref_number: "SAL_AUG_2024_001",
    attachment_path: "",
    description: "Monthly salary payment for senior excavator instructor",
    created_by: "hr_admin",
    created_at: "2024-08-22T16:30:00Z",
    updated_at: "2024-08-22T16:30:00Z"
  },
  {
    id: 5,
    type: "income",
    category_id: 1,
    category_name: "Course Enrollment Fees",
    amount: 4500.00,
    transaction_date: "2024-08-21",
    payment_mode: "Cash",
    payer_name: "David Wilson",
    payer_contact: "+1-555-0456",
    payer_bank_name: "",
    payer_account_number: "",
    payer_upi_id: "",
    payment_ref_number: "CASH_001",
    attachment_path: "",
    description: "Full payment for Advanced Heavy Equipment course",
    created_by: "receptionist",
    created_at: "2024-08-21T10:20:00Z",
    updated_at: "2024-08-21T10:20:00Z"
  },
  {
    id: 6,
    type: "expense",
    category_id: 5,
    category_name: "Fuel Costs",
    amount: 320.50,
    transaction_date: "2024-08-20",
    payment_mode: "UPI",
    receiver_name: "City Fuel Station",
    receiver_contact: "+1-555-0789",
    receiver_bank_name: "",
    receiver_account_number: "",
    receiver_upi_id: "cityfuel@paytm",
    payment_ref_number: "FUEL_240820_001",
    attachment_path: "/uploads/transactions/fuel_receipt.jpg",
    description: "Diesel fuel for training equipment - weekly refill",
    created_by: "operator",
    created_at: "2024-08-20T08:45:00Z",
    updated_at: "2024-08-20T08:45:00Z"
  }
];

// Mock transaction categories data
const TRANSACTION_CATEGORIES = [
  {
    id: 1,
    name: "Course Enrollment Fees",
    slug: "course-enrollment-fees",
    type: "income",
    is_active: true,
    created_at: "2024-01-15T10:30:00Z",
    updated_at: "2024-01-15T10:30:00Z"
  },
  {
    id: 2,
    name: "Certificate Fees",
    slug: "certificate-fees",
    type: "income",
    is_active: true,
    created_at: "2024-01-16T14:20:00Z",
    updated_at: "2024-01-16T14:20:00Z"
  },
  {
    id: 3,
    name: "Equipment Maintenance",
    slug: "equipment-maintenance",
    type: "expense",
    is_active: true,
    created_at: "2024-01-17T09:15:00Z",
    updated_at: "2024-01-17T09:15:00Z"
  },
  {
    id: 4,
    name: "Instructor Salaries",
    slug: "instructor-salaries",
    type: "expense",
    is_active: true,
    created_at: "2024-01-18T16:45:00Z",
    updated_at: "2024-01-18T16:45:00Z"
  },
  {
    id: 5,
    name: "Fuel Costs",
    slug: "fuel-costs",
    type: "expense",
    is_active: true,
    created_at: "2024-01-19T11:30:00Z",
    updated_at: "2024-01-19T11:30:00Z"
  },
  {
    id: 6,
    name: "Late Payment Fees",
    slug: "late-payment-fees",
    type: "income",
    is_active: false,
    created_at: "2024-01-20T13:10:00Z",
    updated_at: "2024-02-15T10:20:00Z"
  }
];

// Simulated API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class InternalApi {
  // Course Management Methods
  async getCourses() {
    await delay(500);
    return {
      success: true,
      data: INTERNAL_COURSES.sort((a, b) => a.display_order - b.display_order),
      message: "Courses retrieved successfully"
    };
  }

  async getCourseById(id) {
    await delay(300);
    const course = INTERNAL_COURSES.find(course => course.id === parseInt(id));
    if (course) {
      return {
        success: true,
        data: course,
        message: "Course retrieved successfully"
      };
    }
    return {
      success: false,
      data: null,
      message: "Course not found"
    };
  }

  async createCourse(courseData) {
    await delay(1000);
    const newCourse = {
      ...courseData,
      id: Math.max(...INTERNAL_COURSES.map(c => c.id)) + 1,
      slug: this.generateSlug(courseData.title),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      status: "active"
    };
    
    INTERNAL_COURSES.push(newCourse);
    
    return {
      success: true,
      data: newCourse,
      message: "Course created successfully"
    };
  }

  async updateCourse(id, courseData) {
    await delay(800);
    const courseIndex = INTERNAL_COURSES.findIndex(course => course.id === parseInt(id));
    
    if (courseIndex !== -1) {
      INTERNAL_COURSES[courseIndex] = {
        ...INTERNAL_COURSES[courseIndex],
        ...courseData,
        slug: courseData.title ? this.generateSlug(courseData.title) : INTERNAL_COURSES[courseIndex].slug,
        updated_at: new Date().toISOString()
      };
      
      return {
        success: true,
        data: INTERNAL_COURSES[courseIndex],
        message: "Course updated successfully"
      };
    }
    
    return {
      success: false,
      data: null,
      message: "Course not found"
    };
  }

  async deleteCourse(id) {
    await delay(500);
    const courseIndex = INTERNAL_COURSES.findIndex(course => course.id === parseInt(id));
    
    if (courseIndex !== -1) {
      const deletedCourse = INTERNAL_COURSES.splice(courseIndex, 1)[0];
      return {
        success: true,
        data: deletedCourse,
        message: "Course deleted successfully"
      };
    }
    
    return {
      success: false,
      data: null,
      message: "Course not found"
    };
  }

  async toggleCourseStatus(id) {
    await delay(400);
    const courseIndex = INTERNAL_COURSES.findIndex(course => course.id === parseInt(id));
    
    if (courseIndex !== -1) {
      const newStatus = INTERNAL_COURSES[courseIndex].status === 'active' ? 'inactive' : 'active';
      INTERNAL_COURSES[courseIndex] = {
        ...INTERNAL_COURSES[courseIndex],
        status: newStatus,
        updated_at: new Date().toISOString()
      };
      
      return {
        success: true,
        data: INTERNAL_COURSES[courseIndex],
        message: `Course ${newStatus === 'active' ? 'activated' : 'deactivated'} successfully`
      };
    }
    
    return {
      success: false,
      data: null,
      message: "Course not found"
    };
  }

  async updateCourseOrder(courseId, newOrder) {
    await delay(300);
    const courseIndex = INTERNAL_COURSES.findIndex(course => course.id === parseInt(courseId));
    
    if (courseIndex !== -1) {
      INTERNAL_COURSES[courseIndex].display_order = newOrder;
      INTERNAL_COURSES[courseIndex].updated_at = new Date().toISOString();
      
      return {
        success: true,
        data: INTERNAL_COURSES[courseIndex],
        message: "Course order updated successfully"
      };
    }
    
    return {
      success: false,
      data: null,
      message: "Course not found"
    };
  }

  async reorderCourses(courseOrders) {
    await delay(600);
    
    // Update display_order for all courses
    courseOrders.forEach(({ id, display_order }) => {
      const courseIndex = INTERNAL_COURSES.findIndex(course => course.id === parseInt(id));
      if (courseIndex !== -1) {
        INTERNAL_COURSES[courseIndex].display_order = display_order;
        INTERNAL_COURSES[courseIndex].updated_at = new Date().toISOString();
      }
    });
    
    return {
      success: true,
      data: INTERNAL_COURSES.sort((a, b) => a.display_order - b.display_order),
      message: "Course order updated successfully"
    };
  }

  async addCourseLanguageVariant(courseId, languageData) {
    await delay(800);
    const baseCourse = INTERNAL_COURSES.find(course => course.id === parseInt(courseId));
    
    if (baseCourse) {
      const newCourse = {
        ...languageData,
        id: Math.max(...INTERNAL_COURSES.map(c => c.id)) + 1,
        slug: this.generateSlug(languageData.title),
        // Copy pricing and visual elements from base course
        original_fee: baseCourse.original_fee,
        is_discounted: baseCourse.is_discounted,
        discounted_fee: baseCourse.discounted_fee,
        discount_percentage: baseCourse.discount_percentage,
        show_offer_badge: baseCourse.show_offer_badge,
        offer_badge_text: baseCourse.offer_badge_text,
        thumbnail: baseCourse.thumbnail,
        display_order: baseCourse.display_order,
        status: "active",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      INTERNAL_COURSES.push(newCourse);
      
      return {
        success: true,
        data: newCourse,
        message: "Course language variant added successfully"
      };
    }
    
    return {
      success: false,
      data: null,
      message: "Base course not found"
    };
  }

  // Transaction Categories Management Methods
  async getTransactionCategories(params = {}) {
    await delay(400);
    let categories = [...TRANSACTION_CATEGORIES];
    
    // Apply search filter
    if (params.search) {
      const searchTerm = params.search.toLowerCase();
      categories = categories.filter(category => 
        category.name.toLowerCase().includes(searchTerm) ||
        category.slug.toLowerCase().includes(searchTerm)
      );
    }
    
    // Apply type filter
    if (params.type && params.type !== 'all') {
      categories = categories.filter(category => category.type === params.type);
    }
    
    // Sort by created_at (newest first)
    categories.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    
    // Apply pagination
    const page = parseInt(params.page) || 1;
    const limit = parseInt(params.limit) || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedCategories = categories.slice(startIndex, endIndex);
    
    return {
      success: true,
      data: paginatedCategories,
      pagination: {
        current_page: page,
        per_page: limit,
        total: categories.length,
        last_page: Math.ceil(categories.length / limit),
        from: startIndex + 1,
        to: Math.min(endIndex, categories.length)
      },
      message: "Transaction categories retrieved successfully"
    };
  }
  
  async getTransactionCategoryById(id) {
    await delay(200);
    const category = TRANSACTION_CATEGORIES.find(cat => cat.id === parseInt(id));
    
    if (category) {
      return {
        success: true,
        data: category,
        message: "Transaction category retrieved successfully"
      };
    }
    
    return {
      success: false,
      data: null,
      message: "Transaction category not found"
    };
  }
  
  async createTransactionCategory(categoryData) {
    await delay(600);
    
    // Check for duplicate name
    const existingCategory = TRANSACTION_CATEGORIES.find(cat => 
      cat.name.toLowerCase() === categoryData.name.toLowerCase()
    );
    
    if (existingCategory) {
      return {
        success: false,
        data: null,
        message: "A category with this name already exists"
      };
    }
    
    const newCategory = {
      id: Math.max(...TRANSACTION_CATEGORIES.map(c => c.id)) + 1,
      name: categoryData.name,
      slug: this.generateSlug(categoryData.name),
      type: categoryData.type,
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    TRANSACTION_CATEGORIES.push(newCategory);
    
    return {
      success: true,
      data: newCategory,
      message: "Transaction category created successfully"
    };
  }
  
  async updateTransactionCategory(id, categoryData) {
    await delay(600);
    const categoryIndex = TRANSACTION_CATEGORIES.findIndex(cat => cat.id === parseInt(id));
    
    if (categoryIndex === -1) {
      return {
        success: false,
        data: null,
        message: "Transaction category not found"
      };
    }
    
    // Check for duplicate name (exclude current category)
    const existingCategory = TRANSACTION_CATEGORIES.find(cat => 
      cat.name.toLowerCase() === categoryData.name.toLowerCase() && cat.id !== parseInt(id)
    );
    
    if (existingCategory) {
      return {
        success: false,
        data: null,
        message: "A category with this name already exists"
      };
    }
    
    TRANSACTION_CATEGORIES[categoryIndex] = {
      ...TRANSACTION_CATEGORIES[categoryIndex],
      name: categoryData.name,
      slug: this.generateSlug(categoryData.name),
      type: categoryData.type,
      updated_at: new Date().toISOString()
    };
    
    return {
      success: true,
      data: TRANSACTION_CATEGORIES[categoryIndex],
      message: "Transaction category updated successfully"
    };
  }
  
  async deleteTransactionCategory(id) {
    await delay(400);
    const categoryIndex = TRANSACTION_CATEGORIES.findIndex(cat => cat.id === parseInt(id));
    
    if (categoryIndex === -1) {
      return {
        success: false,
        data: null,
        message: "Transaction category not found"
      };
    }
    
    const deletedCategory = TRANSACTION_CATEGORIES.splice(categoryIndex, 1)[0];
    
    return {
      success: true,
      data: deletedCategory,
      message: "Transaction category deleted successfully"
    };
  }

  // Transaction Management Methods
  async getTransactions(params = {}) {
    await delay(500);
    let transactions = [...TRANSACTIONS];
    
    // Apply type filter
    if (params.type && params.type !== 'all') {
      transactions = transactions.filter(transaction => transaction.type === params.type);
    }
    
    // Apply search filter
    if (params.search) {
      const searchTerm = params.search.toLowerCase();
      transactions = transactions.filter(transaction => {
        const payerName = transaction.payer_name || transaction.receiver_name || '';
        const payerContact = transaction.payer_contact || transaction.receiver_contact || '';
        return (
          payerName.toLowerCase().includes(searchTerm) ||
          payerContact.toLowerCase().includes(searchTerm) ||
          transaction.description.toLowerCase().includes(searchTerm) ||
          transaction.payment_ref_number.toLowerCase().includes(searchTerm)
        );
      });
    }
    
    // Apply category filter
    if (params.category_id) {
      transactions = transactions.filter(transaction => transaction.category_id === parseInt(params.category_id));
    }
    
    // Apply date range filter
    if (params.date_from) {
      transactions = transactions.filter(transaction => transaction.transaction_date >= params.date_from);
    }
    if (params.date_to) {
      transactions = transactions.filter(transaction => transaction.transaction_date <= params.date_to);
    }
    
    // Sort by transaction_date (default: latest first)
    const sortOrder = params.sort_order || 'desc';
    transactions.sort((a, b) => {
      const dateA = new Date(a.transaction_date);
      const dateB = new Date(b.transaction_date);
      return sortOrder === 'desc' ? dateB - dateA : dateA - dateB;
    });
    
    // Apply pagination
    const page = parseInt(params.page) || 1;
    const limit = parseInt(params.limit) || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedTransactions = transactions.slice(startIndex, endIndex);
    
    return {
      success: true,
      data: paginatedTransactions,
      pagination: {
        current_page: page,
        per_page: limit,
        total: transactions.length,
        last_page: Math.ceil(transactions.length / limit),
        from: startIndex + 1,
        to: Math.min(endIndex, transactions.length)
      },
      message: "Transactions retrieved successfully"
    };
  }
  
  async getTransactionById(id) {
    await delay(200);
    const transaction = TRANSACTIONS.find(txn => txn.id === parseInt(id));
    
    if (transaction) {
      return {
        success: true,
        data: transaction,
        message: "Transaction retrieved successfully"
      };
    }
    
    return {
      success: false,
      data: null,
      message: "Transaction not found"
    };
  }
  
  async createTransaction(transactionData) {
    await delay(700);
    
    // Get category details
    const category = TRANSACTION_CATEGORIES.find(cat => cat.id === parseInt(transactionData.category_id));
    if (!category) {
      return {
        success: false,
        data: null,
        message: "Invalid category selected"
      };
    }
    
    const newTransaction = {
      id: Math.max(...TRANSACTIONS.map(t => t.id)) + 1,
      ...transactionData,
      category_name: category.name,
      type: category.type,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    TRANSACTIONS.push(newTransaction);
    
    return {
      success: true,
      data: newTransaction,
      message: "Transaction created successfully"
    };
  }
  
  async updateTransaction(id, transactionData) {
    await delay(600);
    const transactionIndex = TRANSACTIONS.findIndex(txn => txn.id === parseInt(id));
    
    if (transactionIndex === -1) {
      return {
        success: false,
        data: null,
        message: "Transaction not found"
      };
    }
    
    // Get category details if category changed
    if (transactionData.category_id) {
      const category = TRANSACTION_CATEGORIES.find(cat => cat.id === parseInt(transactionData.category_id));
      if (!category) {
        return {
          success: false,
          data: null,
          message: "Invalid category selected"
        };
      }
      transactionData.category_name = category.name;
      transactionData.type = category.type;
    }
    
    TRANSACTIONS[transactionIndex] = {
      ...TRANSACTIONS[transactionIndex],
      ...transactionData,
      updated_at: new Date().toISOString()
    };
    
    return {
      success: true,
      data: TRANSACTIONS[transactionIndex],
      message: "Transaction updated successfully"
    };
  }
  
  async deleteTransaction(id) {
    await delay(400);
    const transactionIndex = TRANSACTIONS.findIndex(txn => txn.id === parseInt(id));
    
    if (transactionIndex === -1) {
      return {
        success: false,
        data: null,
        message: "Transaction not found"
      };
    }
    
    const deletedTransaction = TRANSACTIONS.splice(transactionIndex, 1)[0];
    
    return {
      success: true,
      data: deletedTransaction,
      message: "Transaction deleted successfully"
    };
  }

  // Helper method to generate slug from title
  generateSlug(title) {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim('-');
  }
}

export default new InternalApi();
