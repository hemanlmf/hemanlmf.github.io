# Potential autoregression
phi = c(0.8) #ar
sigma = 1
mu = 0
T = 2000
N = 1000
p = 0.5

# Simulate potential outcomes
yt = arima.sim(list(ar=phi), T, rand.gen = rnorm) + mu
# Simulate treatment path
wt = matrix(rbinom(N*T, 1, p), nrow = T, ncol = N)

# Estimate mean response of treated
observed = vector(length=N)
imputed = rep(0,N)

# Run time comparison
runTime = vector(length=4)
method = c("naive", "vectorized naive", "linear", "vectorized linear")

# Naive code
start = Sys.time()
for (i in 1:N)
{
	# Observed mean
	t0 = which(wt[,i]==0)
	t1 = which(wt[,i]==1)
	observed[i] = mean(yt[t1])
	# Imputed mean
	for (t in t0)
	{
		tDiff = t-t1
		b = min(tDiff[which(tDiff>0)])
		f = -max(tDiff[which(tDiff<0)])
		b = ifelse(is.infinite(b),0,b)
		f = ifelse(is.infinite(f),0,f)
		imputed[i] = imputed[i] + observed[i]+(phi^b*(1-phi^(2*f))*(yt[t-b]-observed[i]) + phi^f*(1-phi^(2*b))*(yt[t+f]-observed[i]))/(1-phi^(2*b+2*f))
	}
	imputed[i] = (imputed[i] + sum(yt[t1]))/T
}
end = Sys.time()
runTime[1] = end-start

# Vectorized code
start = Sys.time()
for (i in 1:N)
{
	# Observed mean
	t0 = which(wt[,i]==0)
	t1 = which(wt[,i]==1)
	observed[i] = mean(yt[t1])
	# Imputed mean
	b = rep(0,length(t0))
	f = b
	for (t in 1:length(t0))
	{
		tDiff = t0[t]-t1
		b[t] = min(tDiff[which(tDiff>0)])
		f[t] = -max(tDiff[which(tDiff<0)])
		b[t] = ifelse(is.infinite(b[t]),0,b[t])
		f[t] = ifelse(is.infinite(f[t]),0,f[t])
	}
	imputed[i] =  (sum(observed[i]+(phi^b*(1-phi^(2*f))*(yt[t0-b]-observed[i]) + phi^f*(1-phi^(2*b))*(yt[t0+f]-observed[i]))/(1-phi^(2*b+2*f))) + sum(yt[t1]))/T
}
end = Sys.time()
runTime[2] = end-start

# Linear operation code
start = Sys.time()
for (i in 1:N)
{
	# Observed mean
	t0 = which(wt[,i]==0)
	t1 = which(wt[,i]==1)
	observed[i] = mean(yt[t1])
	# Get the closest time index of treated response
	b = rep(NA,T) #initialize as NA to avoid wrong location calculation
	f = rep(NA,T) #replace NA with zero at the end
	b[t1] = t1
	f[t1] = t1
	for (t in 2:T)
		b[t] = ifelse(is.na(b[t]),b[t-1],b[t])
	for (t in (T-1):1)
		f[t] = ifelse(is.na(f[t]),f[t+1],f[t])
	# Transform closest time index to distance from that index
	b[t0] = t0 - b[t0]
	f[t0] = f[t0] - t0
	b[which(is.na(b))] = 0
	f[which(is.na(f))] = 0
	b = b[-t1]
	f = f[-t1]
	# Compute the AR(1) imputed mean
	imputed[i] = (sum(observed[i]+(phi^b*(1-phi^(2*f))*(yt[t0-b]-observed[i]) + phi^f*(1-phi^(2*b))*(yt[t0+f]-observed[i]))/(1-phi^(2*b+2*f))) + sum(yt[t1]))/T
}
end = Sys.time()
runTime[3] = end-start

# Vectorized linear operation code
# Credit to Keith
start = Sys.time()
for (i in 1:N)
{
	# Observed mean
	t0 = which(wt[,i]==0)
	t1 = which(wt[,i]==1)
	observed[i] = mean(yt[t1])
	# Get the closest time index of treated response
	csW = cumsum(wt[,i])
	f = t1[csW+1]
	# If treatment path begins with 0, b will be undefined
	csW[which(csW==0)] = NA
	b = t1[csW] # This will output NA for first few t0 elements and handle below
	# Transform closest time index to distance from that index
	b[t0] = t0 - b[t0]
	f[t0] = f[t0] - t0
	b[which(is.na(b))] = 0
	f[which(is.na(f))] = 0
	b = b[-t1]
	f = f[-t1]
	# Compute the AR(1) imputed mean
	imputed[i] = (sum(observed[i]+(phi^b*(1-phi^(2*f))*(yt[t0-b]-observed[i]) + phi^f*(1-phi^(2*b))*(yt[t0+f]-observed[i]))/(1-phi^(2*b+2*f))) + sum(yt[t1]))/T
}
end = Sys.time()
runTime[4] = end-start

# Show result
setNames(runTime, method)

# Help verify if the methods have same output
# hist(observed)
# abline(v=mean(yt), col="red")
# hist(imputed)
# abline(v=mean(yt), col="red")
# mean((observed-mean(yt))^2)
# mean((imputed-mean(yt))^2)