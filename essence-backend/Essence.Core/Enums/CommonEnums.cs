namespace Essence.Core.Enums;

public enum UserRole
{
    Customer,
    Waiter,
    KitchenStaff,
    Cashier,
    Manager,
    SuperAdmin
}

public enum OrderStatus
{
    Pending,
    Accepted,
    Preparing,
    Ready,
    Served,
    Completed,
    Cancelled
}

public enum ShiftStatus
{
    OnDuty,
    Break,
    OffDuty
}

public enum PaymentMethod
{
    Cash,
    Card,
    MtnMoMo,
    AirtelMoney
}
