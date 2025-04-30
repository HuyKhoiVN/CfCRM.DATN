using System;
using System.Collections.Generic;
using System.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Query.SqlExpressions;
using Microsoft.EntityFrameworkCore.Storage;

namespace CoffeeCRM.Data.Model
{
    public partial class SysDbContext : DbContext
    {
        public SysDbContext(DbContextOptions<SysDbContext> options)
            : base(options)
        {
        }

        public virtual DbSet<Account> Accounts { get; set; } = null!;
        public virtual DbSet<AccountActivity> AccountActivities { get; set; } = null!;
        public virtual DbSet<Attendance> Attendances { get; set; } = null!;
        public virtual DbSet<CashFlow> CashFlows { get; set; } = null!;
        public virtual DbSet<Debt> Debts { get; set; } = null!;
        public virtual DbSet<Dish> Dishes { get; set; } = null!;
        public virtual DbSet<DishCategory> DishCategories { get; set; } = null!;
        public virtual DbSet<DishOrder> DishOrders { get; set; } = null!;
        public virtual DbSet<DishOrderDetail> DishOrderDetails { get; set; } = null!;
        public virtual DbSet<DishOrderStatus> DishOrderStatuses { get; set; } = null!;
        public virtual DbSet<FinancialTarget> FinancialTargets { get; set; } = null!;
        public virtual DbSet<Ingredient> Ingredients { get; set; } = null!;
        public virtual DbSet<IngredientCategory> IngredientCategories { get; set; } = null!;
        public virtual DbSet<InventoryAudit> InventoryAudits { get; set; } = null!;
        public virtual DbSet<InventoryDiscrepancy> InventoryDiscrepancies { get; set; } = null!;
        public virtual DbSet<Invoice> Invoices { get; set; } = null!;
        public virtual DbSet<InvoiceDetail> InvoiceDetails { get; set; } = null!;
        public virtual DbSet<Notification> Notifications { get; set; } = null!;
        public virtual DbSet<NotificationStatus> NotificationStatuses { get; set; } = null!;
        public virtual DbSet<PurchaseOrder> PurchaseOrders { get; set; } = null!;
        public virtual DbSet<PurchaseOrderDetail> PurchaseOrderDetails { get; set; } = null!;
        public virtual DbSet<Role> Roles { get; set; } = null!;
        public virtual DbSet<StockLevel> StockLevels { get; set; } = null!;
        public virtual DbSet<StockTransaction> StockTransactions { get; set; } = null!;
        public virtual DbSet<StockTransactionDetail> StockTransactionDetails { get; set; } = null!;
        public virtual DbSet<Supplier> Suppliers { get; set; } = null!;
        public virtual DbSet<Table> Tables { get; set; } = null!;
        public virtual DbSet<TableBooking> TableBookings { get; set; } = null!;
        public virtual DbSet<Unit> Units { get; set; } = null!;
        public virtual DbSet<Warehouse> Warehouses { get; set; } = null!;

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.HasDbFunction(typeof(CustomQuery).GetMethod(nameof(CustomQuery.ToCustomString))).HasTranslation(
                e =>
                {
                    return new SqlFunctionExpression(functionName: "format", arguments: new[]{
                                 e.First(),
                                 new SqlFragmentExpression("'dd/MM/yyyy HH:mm:ss'")
                            }, nullable: true, new List<bool>(), type: typeof(string), typeMapping: new StringTypeMapping("", DbType.String));
                });

            modelBuilder.HasDbFunction(typeof(CustomQuery).GetMethod(nameof(CustomQuery.ToDateString))).HasTranslation(
                e =>
                {
                    return new SqlFunctionExpression(functionName: "format", arguments: new[]{
                                 e.First(),
                                 new SqlFragmentExpression("'dd/MM/yyyy'")
                            }, nullable: true, new List<bool>(), type: typeof(string), typeMapping: new StringTypeMapping("", DbType.String));
                });
            modelBuilder.Entity<Account>(entity =>
            {
                entity.ToTable("Account");

                entity.Property(e => e.AccountCode).HasMaxLength(255);

                entity.Property(e => e.Active)
                    .IsRequired()
                    .HasDefaultValueSql("((1))");

                entity.Property(e => e.CreatedTime).HasColumnType("datetime");

                entity.Property(e => e.Dob)
                    .HasColumnType("datetime")
                    .HasColumnName("DOB");

                entity.Property(e => e.Email).HasMaxLength(100);

                entity.Property(e => e.FullName).HasMaxLength(255);

                entity.Property(e => e.PhoneNumber).HasMaxLength(20);

                entity.Property(e => e.Username).HasMaxLength(50);

                entity.HasOne(d => d.Role)
                    .WithMany(p => p.Accounts)
                    .HasForeignKey(d => d.RoleId)
                    .HasConstraintName("FK__Account__RoleId__08B54D69");
            });

            modelBuilder.Entity<AccountActivity>(entity =>
            {
                entity.ToTable("AccountActivity");

                entity.Property(e => e.Active)
                    .IsRequired()
                    .HasDefaultValueSql("((1))");

                entity.Property(e => e.ActivityCode).HasMaxLength(255);

                entity.Property(e => e.ActivityDescription).HasMaxLength(500);

                entity.Property(e => e.ActivityType).HasMaxLength(50);

                entity.Property(e => e.CreatedTime).HasColumnType("datetime");

                entity.HasOne(d => d.Account)
                    .WithMany(p => p.AccountActivities)
                    .HasForeignKey(d => d.AccountId)
                    .HasConstraintName("FK__AccountAc__Accou__09A971A2");
            });

            modelBuilder.Entity<Attendance>(entity =>
            {
                entity.ToTable("Attendance");

                entity.Property(e => e.Active)
                    .IsRequired()
                    .HasDefaultValueSql("((1))");

                entity.Property(e => e.CheckInTime).HasColumnType("datetime");

                entity.Property(e => e.CheckOutTime).HasColumnType("datetime");

                entity.Property(e => e.CreatedTime).HasColumnType("datetime");

                entity.HasOne(d => d.Account)
                    .WithMany(p => p.Attendances)
                    .HasForeignKey(d => d.AccountId)
                    .HasConstraintName("FK__Attendanc__Accou__0A9D95DB");
            });

            modelBuilder.Entity<CashFlow>(entity =>
            {
                entity.ToTable("CashFlow");

                entity.Property(e => e.Active)
                    .IsRequired()
                    .HasDefaultValueSql("((1))");

                entity.Property(e => e.CreatedTime).HasColumnType("datetime");

                entity.Property(e => e.FlowType).HasMaxLength(255);

                entity.Property(e => e.Note).HasMaxLength(255);

                entity.Property(e => e.TotalMoney).HasColumnType("decimal(18, 0)");

                entity.HasOne(d => d.Account)
                    .WithMany(p => p.CashFlows)
                    .HasForeignKey(d => d.AccountId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK__CashFlow__Accoun__0B91BA14");
            });

            modelBuilder.Entity<Debt>(entity =>
            {
                entity.ToTable("Debt");

                entity.Property(e => e.Active)
                    .IsRequired()
                    .HasDefaultValueSql("((1))");

                entity.Property(e => e.CreatedTime).HasColumnType("datetime");

                entity.Property(e => e.DebtCode).HasMaxLength(255);

                entity.Property(e => e.DebtName).HasMaxLength(255);

                entity.Property(e => e.PaIdAt).HasColumnType("datetime");

                entity.Property(e => e.TotalMoney).HasColumnType("decimal(18, 0)");

                entity.HasOne(d => d.Supplier)
                    .WithMany(p => p.Debts)
                    .HasForeignKey(d => d.SupplierId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK__Debt__SupplierId__0C85DE4D");
            });

            modelBuilder.Entity<Dish>(entity =>
            {
                entity.ToTable("Dish");

                entity.Property(e => e.Active)
                    .IsRequired()
                    .HasDefaultValueSql("((1))");

                entity.Property(e => e.CreatedTime).HasColumnType("datetime");

                entity.Property(e => e.DishCode).HasMaxLength(255);

                entity.Property(e => e.DishName).HasMaxLength(100);

                entity.Property(e => e.Photo).HasMaxLength(255);

                entity.Property(e => e.Price).HasColumnType("decimal(18, 0)");

                entity.HasOne(d => d.DishCategory)
                    .WithMany(p => p.Dishes)
                    .HasForeignKey(d => d.DishCategoryId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK__Dish__DishCatego__0D7A0286");
            });

            modelBuilder.Entity<DishCategory>(entity =>
            {
                entity.ToTable("DishCategory");

                entity.Property(e => e.Active)
                    .IsRequired()
                    .HasDefaultValueSql("((1))");

                entity.Property(e => e.CreatedTime).HasColumnType("datetime");

                entity.Property(e => e.DishCategoryCode).HasMaxLength(255);

                entity.Property(e => e.DishCateogryName).HasMaxLength(100);
            });

            modelBuilder.Entity<DishOrder>(entity =>
            {
                entity.ToTable("DishOrder");

                entity.Property(e => e.Active)
                    .IsRequired()
                    .HasDefaultValueSql("((1))");

                entity.Property(e => e.CreatedTime).HasColumnType("datetime");

                entity.HasOne(d => d.Account)
                    .WithMany(p => p.DishOrders)
                    .HasForeignKey(d => d.AccountId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("fk_dishOrder_account");

                entity.HasOne(d => d.DishOrderStatus)
                    .WithMany(p => p.DishOrders)
                    .HasForeignKey(d => d.DishOrderStatusId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK__DishOrder__DishO__0E6E26BF");

                entity.HasOne(d => d.Table)
                    .WithMany(p => p.DishOrders)
                    .HasForeignKey(d => d.TableId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK__DishOrder__Table__0F624AF8");
            });

            modelBuilder.Entity<DishOrderDetail>(entity =>
            {
                entity.ToTable("DishOrderDetail");

                entity.Property(e => e.Active)
                    .IsRequired()
                    .HasDefaultValueSql("((1))");

                entity.Property(e => e.CreatedTime).HasColumnType("datetime");

                entity.Property(e => e.Price).HasColumnType("decimal(18, 0)");

                entity.HasOne(d => d.Dish)
                    .WithMany(p => p.DishOrderDetails)
                    .HasForeignKey(d => d.DishId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK__DishOrder__DishI__10566F31");

                entity.HasOne(d => d.DishOrder)
                    .WithMany(p => p.DishOrderDetails)
                    .HasForeignKey(d => d.DishOrderId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK__DishOrder__DishO__114A936A");
            });

            modelBuilder.Entity<DishOrderStatus>(entity =>
            {
                entity.ToTable("DishOrderStatus");

                entity.Property(e => e.Active)
                    .IsRequired()
                    .HasDefaultValueSql("((1))");

                entity.Property(e => e.CreatedTime).HasColumnType("datetime");

                entity.Property(e => e.DishOrderStatusCode).HasMaxLength(255);

                entity.Property(e => e.DishOrderStatusName).HasMaxLength(255);
            });

            modelBuilder.Entity<FinancialTarget>(entity =>
            {
                entity.ToTable("FinancialTarget");

                entity.Property(e => e.Active)
                    .IsRequired()
                    .HasDefaultValueSql("((1))");

                entity.Property(e => e.CreatedTime).HasColumnType("datetime");

                entity.Property(e => e.EndDate).HasColumnType("datetime");

                entity.Property(e => e.Period).HasMaxLength(50);

                entity.Property(e => e.StartDate).HasColumnType("datetime");

                entity.Property(e => e.TargetProfit).HasColumnType("decimal(18, 0)");

                entity.Property(e => e.TargetRevenue).HasColumnType("decimal(18, 0)");
            });

            modelBuilder.Entity<Ingredient>(entity =>
            {
                entity.ToTable("Ingredient");

                entity.Property(e => e.Active)
                    .IsRequired()
                    .HasDefaultValueSql("((1))");

                entity.Property(e => e.AveragePrice).HasColumnType("decimal(18, 0)");

                entity.Property(e => e.CreatedTime).HasColumnType("datetime");

                entity.Property(e => e.IngredientCode).HasMaxLength(255);

                entity.Property(e => e.IngredientName).HasMaxLength(100);

                entity.HasOne(d => d.IngredientCategory)
                    .WithMany(p => p.Ingredients)
                    .HasForeignKey(d => d.IngredientCategoryId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK__Ingredien__Ingre__123EB7A3");

                entity.HasOne(d => d.Supplier)
                    .WithMany(p => p.Ingredients)
                    .HasForeignKey(d => d.SupplierId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK__Ingredien__Suppl__1332DBDC");

                entity.HasOne(d => d.Unit)
                    .WithMany(p => p.Ingredients)
                    .HasForeignKey(d => d.UnitId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK__Ingredien__UnitI__14270015");
            });

            modelBuilder.Entity<IngredientCategory>(entity =>
            {
                entity.ToTable("IngredientCategory");

                entity.Property(e => e.Active)
                    .IsRequired()
                    .HasDefaultValueSql("((1))");

                entity.Property(e => e.CreatedTime).HasColumnType("datetime");

                entity.Property(e => e.IngredientCategoryCode).HasMaxLength(255);

                entity.Property(e => e.IngredientCategoryName).HasMaxLength(100);

                entity.Property(e => e.ParentCategory).HasColumnName("parentCategory");
            });

            modelBuilder.Entity<InventoryAudit>(entity =>
            {
                entity.ToTable("InventoryAudit");

                entity.Property(e => e.Active)
                    .IsRequired()
                    .HasDefaultValueSql("((1))");

                entity.Property(e => e.AuditCode).HasMaxLength(255);

                entity.Property(e => e.AuditDate).HasColumnType("datetime");

                entity.Property(e => e.Auditor).HasMaxLength(255);

                entity.Property(e => e.CreatedTime).HasColumnType("datetime");

                entity.Property(e => e.Note).HasMaxLength(500);

                entity.HasOne(d => d.Warehouse)
                    .WithMany(p => p.InventoryAudits)
                    .HasForeignKey(d => d.WarehouseId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_InventoryAudit_Warehouse");
            });

            modelBuilder.Entity<InventoryDiscrepancy>(entity =>
            {
                entity.ToTable("InventoryDiscrepancy");

                entity.Property(e => e.Active)
                    .IsRequired()
                    .HasDefaultValueSql("((1))");

                entity.Property(e => e.CreatedTime).HasColumnType("datetime");

                entity.Property(e => e.DiscrepancyReason).HasMaxLength(255);

                entity.HasOne(d => d.InventoryAudit)
                    .WithMany(p => p.InventoryDiscrepancies)
                    .HasForeignKey(d => d.InventoryAuditId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK__Inventory__Inven__151B244E");

                entity.HasOne(d => d.StockLevel)
                    .WithMany(p => p.InventoryDiscrepancies)
                    .HasForeignKey(d => d.StockLevelId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK__Inventory__Stock__160F4887");
            });

            modelBuilder.Entity<Invoice>(entity =>
            {
                entity.ToTable("Invoice");

                entity.Property(e => e.Active)
                    .IsRequired()
                    .HasDefaultValueSql("((1))");

                entity.Property(e => e.CreatedTime).HasColumnType("datetime");

                entity.Property(e => e.InvoiceCode).HasMaxLength(255);

                entity.Property(e => e.PaymentMethod).HasMaxLength(50);

                entity.Property(e => e.PaymentStatus).HasMaxLength(50);

                entity.Property(e => e.TotalGuest).HasDefaultValueSql("((1))");

                entity.Property(e => e.TotalMoney).HasColumnType("decimal(18, 0)");

                entity.HasOne(d => d.Account)
                    .WithMany(p => p.Invoices)
                    .HasForeignKey(d => d.AccountId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK__Invoice__Account__17036CC0");

                entity.HasOne(d => d.Table)
                    .WithMany(p => p.Invoices)
                    .HasForeignKey(d => d.TableId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK__Invoice__TableId__17F790F9");
            });

            modelBuilder.Entity<InvoiceDetail>(entity =>
            {
                entity.ToTable("InvoiceDetail");

                entity.Property(e => e.CreatedTime).HasColumnType("datetime");

                entity.Property(e => e.UnitPrice).HasColumnType("decimal(18, 0)");
            });

            modelBuilder.Entity<Notification>(entity =>
            {
                entity.ToTable("Notification");

                entity.Property(e => e.ApproveTime).HasColumnType("datetime");

                entity.Property(e => e.CreatedTime).HasColumnType("datetime");

                entity.Property(e => e.Name).HasMaxLength(255);

                entity.HasOne(d => d.Account)
                    .WithMany(p => p.Notifications)
                    .HasForeignKey(d => d.AccountId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_Notification_Account");

                entity.HasOne(d => d.NotificationStatus)
                    .WithMany(p => p.Notifications)
                    .HasForeignKey(d => d.NotificationStatusId)
                    .HasConstraintName("FK_Notification_NotificationStatus");

                entity.HasOne(d => d.Sender)
                    .WithMany(p => p.Notifications)
                    .HasForeignKey(d => d.SenderId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_Notification_SenderRole");
            });

            modelBuilder.Entity<NotificationStatus>(entity =>
            {
                entity.ToTable("NotificationStatus");

                entity.Property(e => e.CreatedTime).HasColumnType("datetime");

                entity.Property(e => e.Name).HasMaxLength(255);
            });

            modelBuilder.Entity<PurchaseOrder>(entity =>
            {
                entity.ToTable("PurchaseOrder");

                entity.Property(e => e.Active)
                    .IsRequired()
                    .HasDefaultValueSql("((1))");

                entity.Property(e => e.CreatedTime).HasColumnType("datetime");

                entity.Property(e => e.OrderDate).HasColumnType("datetime");

                entity.Property(e => e.PaymentStatus).HasMaxLength(50);

                entity.Property(e => e.PurchaseOrderCode).HasMaxLength(255);

                entity.Property(e => e.TotalPrice).HasColumnType("decimal(18, 0)");

                entity.HasOne(d => d.Account)
                    .WithMany(p => p.PurchaseOrders)
                    .HasForeignKey(d => d.AccountId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK__PurchaseO__Accou__1BC821DD");
            });

            modelBuilder.Entity<PurchaseOrderDetail>(entity =>
            {
                entity.ToTable("PurchaseOrderDetail");

                entity.Property(e => e.Active)
                    .IsRequired()
                    .HasDefaultValueSql("((1))");

                entity.Property(e => e.CreatedTime).HasColumnType("datetime");

                entity.Property(e => e.UnitPrice).HasColumnType("decimal(18, 0)");

                entity.HasOne(d => d.Ingredient)
                    .WithMany(p => p.PurchaseOrderDetails)
                    .HasForeignKey(d => d.IngredientId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK__PurchaseO__Ingre__1CBC4616");

                entity.HasOne(d => d.PurchaseOrder)
                    .WithMany(p => p.PurchaseOrderDetails)
                    .HasForeignKey(d => d.PurchaseOrderId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK__PurchaseO__Purch__1DB06A4F");
            });

            modelBuilder.Entity<Role>(entity =>
            {
                entity.ToTable("Role");

                entity.Property(e => e.CreatedTime).HasColumnType("datetime");

                entity.Property(e => e.RoleCode).HasMaxLength(255);

                entity.Property(e => e.RoleName).HasMaxLength(255);
            });

            modelBuilder.Entity<StockLevel>(entity =>
            {
                entity.ToTable("StockLevel");

                entity.Property(e => e.Active)
                    .IsRequired()
                    .HasDefaultValueSql("((1))");

                entity.Property(e => e.CreatedTime).HasColumnType("datetime");

                entity.Property(e => e.ExpirationDate).HasColumnType("datetime");

                entity.Property(e => e.LastUpdatedTime)
                    .HasColumnType("datetime")
                    .HasDefaultValueSql("(getdate())");

                entity.Property(e => e.UnitPrice).HasColumnType("decimal(18, 0)");

                entity.HasOne(d => d.Ingredient)
                    .WithMany(p => p.StockLevels)
                    .HasForeignKey(d => d.IngredientId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK__StockLeve__Ingre__1EA48E88");

                entity.HasOne(d => d.Warehouse)
                    .WithMany(p => p.StockLevels)
                    .HasForeignKey(d => d.WarehouseId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK__StockLeve__Wareh__1F98B2C1");
            });

            modelBuilder.Entity<StockTransaction>(entity =>
            {
                entity.ToTable("StockTransaction");

                entity.Property(e => e.Active)
                    .IsRequired()
                    .HasDefaultValueSql("((1))");

                entity.Property(e => e.CreatedTime).HasColumnType("datetime");

                entity.Property(e => e.Status).HasMaxLength(100);

                entity.Property(e => e.StockTransactionCode).HasMaxLength(255);

                entity.Property(e => e.TotalMoney).HasColumnType("decimal(18, 0)");

                entity.Property(e => e.TransactionDate).HasColumnType("datetime");

                entity.Property(e => e.TransactionType)
                    .HasMaxLength(100)
                    .IsUnicode(false);

                entity.HasOne(d => d.Account)
                    .WithMany(p => p.StockTransactions)
                    .HasForeignKey(d => d.AccountId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK__StockTran__Accou__208CD6FA");

                entity.HasOne(d => d.Warehouse)
                    .WithMany(p => p.StockTransactions)
                    .HasForeignKey(d => d.WarehouseId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK__StockTran__Wareh__2180FB33");
            });

            modelBuilder.Entity<StockTransactionDetail>(entity =>
            {
                entity.ToTable("StockTransactionDetail");

                entity.Property(e => e.Active)
                    .IsRequired()
                    .HasDefaultValueSql("((1))");

                entity.Property(e => e.CreatedTime).HasColumnType("datetime");

                entity.HasOne(d => d.StockLevel)
                    .WithMany(p => p.StockTransactionDetails)
                    .HasForeignKey(d => d.StockLevelId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK__StockTran__Stock__22751F6C");

                entity.HasOne(d => d.StockTransaction)
                    .WithMany(p => p.StockTransactionDetails)
                    .HasForeignKey(d => d.StockTransactionId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK__StockTran__Stock__236943A5");
            });

            modelBuilder.Entity<Supplier>(entity =>
            {
                entity.ToTable("Supplier");

                entity.Property(e => e.Active)
                    .IsRequired()
                    .HasDefaultValueSql("((1))");

                entity.Property(e => e.Address).HasMaxLength(300);

                entity.Property(e => e.ContactInfo).HasMaxLength(50);

                entity.Property(e => e.CreatedTime).HasColumnType("datetime");

                entity.Property(e => e.SupplierCode).HasMaxLength(255);

                entity.Property(e => e.SupplierName).HasMaxLength(255);
            });

            modelBuilder.Entity<Table>(entity =>
            {
                entity.ToTable("Table");

                entity.Property(e => e.CreatedTime).HasColumnType("datetime");

                entity.Property(e => e.TableCode).HasMaxLength(255);

                entity.Property(e => e.TableName).HasMaxLength(255);

                entity.Property(e => e.TableStatus).HasMaxLength(255);
            });

            modelBuilder.Entity<TableBooking>(entity =>
            {
                entity.ToTable("TableBooking");

                entity.Property(e => e.Active)
                    .IsRequired()
                    .HasDefaultValueSql("((1))");

                entity.Property(e => e.BookingStatus).HasMaxLength(255);

                entity.Property(e => e.BookingTime).HasColumnType("datetime");

                entity.Property(e => e.CheckinTime).HasColumnType("datetime");

                entity.Property(e => e.CreatedTime).HasColumnType("datetime");

                entity.Property(e => e.CustomerName).HasMaxLength(255);

                entity.Property(e => e.Deposit).HasColumnType("decimal(18, 0)");

                entity.Property(e => e.PhoneNumber).HasMaxLength(50);

                entity.HasOne(d => d.Account)
                    .WithMany(p => p.TableBookings)
                    .HasForeignKey(d => d.AccountId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK__TableBook__Accou__245D67DE");

                entity.HasOne(d => d.Table)
                    .WithMany(p => p.TableBookings)
                    .HasForeignKey(d => d.TableId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK__TableBook__Table__25518C17");
            });

            modelBuilder.Entity<Unit>(entity =>
            {
                entity.ToTable("Unit");

                entity.Property(e => e.Active)
                    .IsRequired()
                    .HasDefaultValueSql("((1))");

                entity.Property(e => e.CreatedTime).HasColumnType("datetime");

                entity.Property(e => e.UnitCode).HasMaxLength(255);

                entity.Property(e => e.UnitName).HasMaxLength(255);
            });

            modelBuilder.Entity<Warehouse>(entity =>
            {
                entity.ToTable("Warehouse");

                entity.Property(e => e.Active)
                    .IsRequired()
                    .HasDefaultValueSql("((1))");

                entity.Property(e => e.CreatedTime).HasColumnType("datetime");

                entity.Property(e => e.Location).HasMaxLength(255);

                entity.Property(e => e.WarehouseCode).HasMaxLength(255);

                entity.Property(e => e.WarehouseName).HasMaxLength(255);
            });

            OnModelCreatingPartial(modelBuilder);
        }

        partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
    }
}
