CREATE VIEW SubscriptionWithDetails AS
SELECT
    s.id,
    s.status,
    s.stripeCustomerId,
    p.stripeId as stripeProductId,
    s.stripeId,
    s.productId,
    p.name as productName,
    p.amount as amount,
    p.stripeId as productStripeId,
    u.id as userId,
    u.name as userName,
    u.email as email,
    u.hasShirt,
    s.createdDate,
    s.lastPaymentDate,
    s.expirationDate
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
        or p.name like '%Membership%'
    )
    and amount >= 20