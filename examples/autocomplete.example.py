"""
In this script we're going to graph some probability distributions. We'll look at two main distributions:
normal distribution and the poisson distribution. We're going to create a few graphs in the same figure, with each graph in a new row.
We'll use seaborn for these graphs because it looks great and allows us to select a color palette that supports color blindness.
For both distribution types, each graph we create will have adjusted parameters, skewing the distribution so we can see their effects.
"""

import seaborn as sns
import matplotlib.pyplot as plt
import numpy as np
from scipy.stats import norm, poisson

# set the style of the plots
sns.set_theme(style="ticks")

fig, axs = plt.subplots(ncols=1, nrows=2, figsize=(20, 20))

# now we can create the normal distributions and graph them.
# instead of scipy.stats, we'll use np.random.normal to get a big array of random numbers
normal_array = np.random.normal(loc=100, scale=15, size=1000)

axs[0].hist(normal_array, bins=30, color="skyblue", alpha=0.7)
axs[0].set_title("Normal Distribution")
axs[0].set_xlabel("Value")
axs[0].set_ylabel("Frequency")

# now let's set a different mean for the normal distribution for the second graph
normal_array = np.random.normal(loc=80, scale=15, size=1000)
axs[1].hist(normal_array, bins=30, color="skyblue", alpha=0.7)
axs[1].set_title("Normal Distribution (shifted)")
axs[1].set_xlabel("Value")
axs[1].set_ylabel("Frequency")

# for the third distribution graph, let's show a flatter distribution, so the tails are larger
# let's set mean to 100 again
normal_array = np.random.normal(loc=100, scale=25, size=1000)
axs[2].hist(normal_array, bins=30, color="skyblue", alpha=0.7)
axs[2].set_title("Normal Distribution (flatter tails)")
axs[2].set_xlabel("Value")
axs[2].set_ylabel("Frequency")

# the parameters are as follows:
# loc: the mean of the distribution
# scale: the standard deviation of the distribution
# size: the number of random numbers to generate

# now draw the graph as if we're in a jupyter notebook
plt.show()

# now let's create the poisson distribution and graph it.
fig, axs = plt.subplots(ncols=1, nrows=3, figsize=(20, 20))

# we'll do a similar thing where we have three rows, and each row will have a different lambda value.
# lambda is the mean of the distribution.
# we'll use the poisson distribution from scipy.stats.
poisson_array = poisson.rvs(mu=10, size=1000)
axs[0].hist(poisson_array, bins=30, color="skyblue", alpha=0.7)
axs[0].set_title("Poisson Distribution")
axs[0].set_xlabel("Value")
axs[0].set_ylabel("Frequency")

# for the second graph, let's set lambda to 20
poisson_array = poisson.rvs(mu=20, size=1000)
axs[1].hist(poisson_array, bins=30, color="skyblue", alpha=0.7)
axs[1].set_title("Poisson Distribution (lambda=20)")
axs[1].set_xlabel("Value")
axs[1].set_ylabel("Frequency")

# for the third graph, let's set lambda to 30
poisson_array = poisson.rvs(mu=30, size=1000)
axs[2].hist(poisson_array, bins=30, color="skyblue", alpha=0.7)
axs[2].set_title("Poisson Distribution (lambda=30)")
axs[2].set_xlabel("Value")
axs[2].set_ylabel("Frequency")

# now draw the graph as if we're in a jupyter notebook
plt.show()