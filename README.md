# 📊 Demoblaze Performance Testing Project

This project evaluates the **performance and stability** of the [Demoblaze](https://www.demoblaze.com/) website under both expected and extreme user loads. The objective is to ensure a seamless user experience during normal and peak traffic conditions, and to identify the system's breaking points under stress.

---

## 🛠️ Tools & Features Used

- 🧪 **Apache JMeter**
- 📄 **CSV Data Set Config** – for dynamic, parameterized test data
- 🔗 **Correlation** – handled dynamic values using **Regular Expression Extractor**
- ✅ **Assertions** – to validate correct server responses
- ⏱️ **Timers** – to simulate realistic user think time
- 📊 **Listeners** – to collect and analyze performance metrics

---

## 📌 Scope of Testing

The following user actions were included in the test flow:

- 📝 Register  
- 🔐 Login  
- 🗂️ View Category  
- 📦 View Product  
- ➕🛒 Add to Cart  
- 👀🛒 View Cart  
- 💳 Checkout and Payment  
- 🚪 Logout

---

## ▶️ How to Use

1. Open **Apache JMeter**.
   
3. Load the test script:
   
   `File > Open > DemoBlaze_InProgress_13-6-2025.jmx`
   
5. Make sure the **CSV file path** is correctly configured in the **CSV Data Set Config** element.
   
7. Run the test using GUI or command line:
   ```bash
   jmeter -n -t DemoBlaze_InProgress_13-6-2025.jmx -l results.jtl -e -o reports/
   ```
   
8. After the test:
   * View results in the **reports/** folder or use **listeners** in the GUI.

---

## 🤝 Contributions

Contributions are welcome! Please fork the repository and create a pull request.
