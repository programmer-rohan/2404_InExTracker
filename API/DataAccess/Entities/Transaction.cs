namespace DataAccess.Entities
{
    public class Transaction
    {
        public int Id { get; set; }
        public DateTime Date { get; set; }
        public string Description { get; set; } = string.Empty;
        public int Amount { get; set; }
        public TransactionType Type { get; set; }
        public DateTime CreatedOn { get; set; }
    }

    public enum TransactionType
    {
        CREDIT, DEBIT
    }
}
