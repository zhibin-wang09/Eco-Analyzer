import numpy as np
import pandas as pd

from pyei.two_by_two import TwoByTwoEI
from pyei.goodmans_er import GoodmansER
from pyei.goodmans_er import GoodmansERBayes
from pyei.r_by_c import RowByColumnEI

import io
import pandas as pd

# Assuming your file is named 'SantaClaraSampleData.csv'
election_dataframe = pd.read_csv('./ar_race_el.csv')


# Replace with the column names in your data that give the percentages of demographic groups of interest
# These fractions must sum to 1 within each precinct.
group_fractions_rbyc = np.array(election_dataframe[['pct_white_pop', 'pct_black_pop', 'pct_asian_pop', 'pct_hispanic_pop', 'pct_other_pop']]).T

# Replace with the column names in your data that give the votes for candidates of interest
# These fractions  must sum to 1 within each precinct.
# Make sure to use to correct denominator - it should match what you use for precinct_pops below
votes_fractions_rbyc = np.array(election_dataframe[['pct_for_trump', 'pct_for_biden', 'pct_for_other']]).T

# replace 'total2' with the column name for the total count of votes in your data
# this should be equal to the sum of the counts of votes for the candidates of interest above!
precinct_pops = np.array(election_dataframe['total']).astype(int)

candidate_names_rbyc = ["Trump", "Biden", "Other"]
demographic_group_names_rbyc = ["White.", "Black", "Asian", "Hispanic", "Other"]
precinct_names = election_dataframe['precinct'] # remove this line if you do not have precinct names or do not need to use them

# Fitting a first r x c model

# Create a RowByColumnEI object
ei_rbyc = RowByColumnEI(model_name='multinomial-dirichlet')

# Fit the model
ei_rbyc.fit(group_fractions_rbyc,
       votes_fractions_rbyc,
       precinct_pops,
       demographic_group_names=demographic_group_names_rbyc,
       candidate_names=candidate_names_rbyc,
       precinct_names=precinct_names, # remove this line if you do not have precinct names or do not need to use them
       chains=4
)

# Generate a simple report to summarize the results
print(ei_rbyc.summary())

ei_rbyc.plot_kdes(plot_by="candidate")