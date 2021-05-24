CREATE VIEW SubscriptionWithDetails AS
SELECT
    s.id,
    s.status,
    s.stripeCustomerId,
    s.stripeId,
    s.productId,
    p.name as productName,
    p.amount as amount,
    p.stripeId as productStripeId,
    u.name as userName,
    u.email as email,
    s.createdDate,
    s.lastPaymentDate
FROM
    Subscription s,
    users u,
    Product p
where
    s.userId = u.id
    and p.id = s.productId
    and (
        p.name like '%TFYP%'
        or p.name like '%Young Profess%'
    )
    and amount >= 20