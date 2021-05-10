export const MembershipOptions = () => {
// https://github.com/mui-org/material-ui/blob/master/docs/src/pages/getting-started/templates/pricing/Pricing.js
const tiers = [
{title:'Single Tree',
price:'20'
buttonText: 'Join Today'
description:['1 Tree Donated','Event Discounts','Exclusive Facebook Group/Slack Access']},
{title:'Grove',
price:'60'
buttonText: 'Join Today'
description:['3 Trees Donated','Event Discounts','Exclusive Facebook Group/Slack Access']},
{title:'Forest',
price:'100+'
buttonText: 'Join Today'
description:['5+  Tree Donated','Event Discounts','Exclusive Facebook Group/Slack Access']}

];
// TODO! give preferred option the green background color
return (
<Grid container spacing={5} alignItems="flex-end">
          {tiers.map((tier) => (
            // Enterprise card is full width at sm breakpoint
            <Grid item key={tier.title} xs={12} sm={tier.title === 'Enterprise' ? 12 : 6} md={4}>
              <Card>
                <CardHeader
                  title={tier.title}
                  subheader={tier.subheader}
                  titleTypographyProps={{ align: 'center' }}
                  subheaderTypographyProps={{ align: 'center' }}
                  action={tier.title === 'Pro' ? <StarIcon /> : null}
                  className={classes.cardHeader}
                />
                <CardContent>
                  <div className={classes.cardPricing}>
                    <Typography component="h2" variant="h3" color="textPrimary">
                      ${tier.price}
                    </Typography>
                    <Typography variant="h6" color="textSecondary">
                      /yr
                    </Typography>
                  </div>
                  <ul>
                    {tier.description.map((line) => (
                      <Typography component="li" variant="subtitle1" align="center" key={line}>
                        {line}
                      </Typography>
                    ))}
                  </ul>
                </CardContent>
                <CardActions>
                  <Button fullWidth variant={tier.buttonVariant} color="primary">
                    {tier.buttonText}
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
)}