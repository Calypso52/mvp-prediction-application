#!/usr/bin/env python
# coding: utf-8

# In[1]:


spark.version


# In[2]:


from pyspark.sql import SparkSession
import matplotlib.pyplot as plt
get_ipython().run_line_magic('matplotlib', 'inline')
import numpy as np


# 1. Data loading

# In[3]:


spark = SparkSession.builder.appName("mvp-prediction").getOrCreate()
print('spark session created')
data_path = 'gs://6893-data/player_stats_2020_2021.csv'
data = spark.read.format("csv").option("header", "true").option("inferschema", "true").load(data_path)
data.show(3)


# In[4]:


data.printSchema()


# 2. Data preprocessing

# In[5]:


from pyspark.ml import Pipeline
from pyspark.ml.feature import OneHotEncoder, StringIndexer, VectorAssembler


# In[6]:


#stages in our Pipeline
stages = []


# In[7]:


# Transform all features into a vector using VectorAssembler
numericCols = ["reb", "ast", "stl", "blk", "tov", "pts"]
assemblerInputs = numericCols
assembler = VectorAssembler(inputCols=assemblerInputs, outputCol="features")
stages += [assembler]


# In[8]:


pipeline = Pipeline(stages=stages)
pipelineModel = pipeline.fit(data)
preppedDataDF = pipelineModel.transform(data)


# In[9]:


preppedDataDF.take(3)


# In[11]:


# Keep relevant columns

cols = data.columns
selectedcols = ["features"] + cols
dataset = preppedDataDF.select(selectedcols)

display(dataset)


# In[12]:


### Randomly split data into training and test sets. set seed for reproducibility
#=====your code here==========
trainingData, testData = dataset.randomSplit([.70, .30], seed=100)
#===============================
print(trainingData.count())
print(testData.count())


# 3. Modeling

# In[13]:


from pyspark.ml.classification import LogisticRegression, RandomForestClassifier
from pyspark.ml.evaluation import MulticlassClassificationEvaluator


# In[14]:


# Fit model to prepped data

#LogisticRegression model, maxIter=10
#=====your code here==========
lrModel = LogisticRegression(featuresCol="features", labelCol="label", maxIter=10).fit(trainingData)
#===============================

# select example rows to display.
predictions = lrModel.transform(testData)
predictions.show()

# compute accuracy on the test set
evaluator = MulticlassClassificationEvaluator(labelCol="label", predictionCol="prediction", metricName="accuracy")
accuracy = evaluator.evaluate(predictions)
print("Test set accuracy = " + str(accuracy))
acc_hist = []
acc_hist.append(accuracy)


# In[15]:


from pyspark.ml.classification import RandomForestClassifier
#Random Forest
#=====your code here==========
rfModel = RandomForestClassifier(featuresCol="features", labelCol="label").fit(trainingData)
#===============================

# select example rows to display.
predictions = rfModel.transform(testData)
predictions.show()

# compute accuracy on the test set
# evaluator = MulticlassClassificationEvaluator(labelCol="label", predictionCol="prediction", metricName="accuracy")
accuracy = evaluator.evaluate(predictions)
print("Test set accuracy = " + str(accuracy))
acc_hist.append(accuracy)


# In[16]:


#NaiveBayes
#=====your code here==========
from pyspark.ml.classification import NaiveBayes
nbModel = NaiveBayes(featuresCol="features", labelCol="label").fit(trainingData)

#===============================


# select example rows to display.
predictions = nbModel.transform(testData)
predictions.show()

# compute accuracy on the test set
evaluator = MulticlassClassificationEvaluator(labelCol="label", predictionCol="prediction", metricName="accuracy")
accuracy = evaluator.evaluate(predictions)
print("Test set accuracy = " + str(accuracy))
acc_hist.append(accuracy)


# In[17]:


#Decision Tree
#=====your code here==========
from pyspark.ml.classification import DecisionTreeClassifier
dtModel = DecisionTreeClassifier(featuresCol="features", labelCol="label").fit(trainingData)

#===============================


# select example rows to display.
predictions = dtModel.transform(testData)
predictions.show()

# compute accuracy on the test set
evaluator = MulticlassClassificationEvaluator(labelCol="label", predictionCol="prediction", metricName="accuracy")
accuracy = evaluator.evaluate(predictions)
print("Test set accuracy = " + str(accuracy))
acc_hist.append(accuracy)


# In[18]:


#Gradient Boosting Trees
#=====your code here==========
from pyspark.ml.classification import GBTClassifier
gbtModel = GBTClassifier(featuresCol="features", labelCol="label").fit(trainingData)

#===============================


# select example rows to display.
predictions = gbtModel.transform(testData)
predictions.show()

# compute accuracy on the test set
evaluator = MulticlassClassificationEvaluator(labelCol="label", predictionCol="prediction", metricName="accuracy")
accuracy = evaluator.evaluate(predictions)
print("Test set accuracy = " + str(accuracy))
acc_hist.append(accuracy)


# In[20]:


# Multi-layer Perceptron
#=====your code here==========
from pyspark.ml.classification import MultilayerPerceptronClassifier
mlpModel = MultilayerPerceptronClassifier(layers=[6, 5, 5, 2], seed=123, featuresCol="features", labelCol="label").fit(trainingData)

#===============================


# select example rows to display.
predictions = mlpModel.transform(testData)
predictions.show()

# compute accuracy on the test set
evaluator = MulticlassClassificationEvaluator(labelCol="label", predictionCol="prediction", metricName="accuracy")
accuracy = evaluator.evaluate(predictions)
print("Test set accuracy = " + str(accuracy))
acc_hist.append(accuracy)


# In[21]:


# Linear Support Vector Machine
#=====your code here==========
from pyspark.ml.classification import LinearSVC
svmModel = LinearSVC(maxIter=10, regParam=0.1).fit(trainingData)

#===============================


# select example rows to display.
predictions = svmModel.transform(testData)
predictions.show()

# compute accuracy on the test set
evaluator = MulticlassClassificationEvaluator(labelCol="label", predictionCol="prediction", metricName="accuracy")
accuracy = evaluator.evaluate(predictions)
print("Test set accuracy = " + str(accuracy))
acc_hist.append(accuracy)


# In[22]:


# One-vs-Rest
#=====your code here==========
from pyspark.ml.classification import LogisticRegression, OneVsRest
lr = LogisticRegression(maxIter=10, tol=1E-6, fitIntercept=True)
ovrModel = OneVsRest(classifier=lr).fit(trainingData)

#===============================


# select example rows to display.
predictions = ovrModel.transform(testData)
predictions.show()

# compute accuracy on the test set
evaluator = MulticlassClassificationEvaluator(labelCol="label", predictionCol="prediction", metricName="accuracy")
accuracy = evaluator.evaluate(predictions)
print("Test set accuracy = " + str(accuracy))
acc_hist.append(accuracy)


# In[23]:


print(len(acc_hist), acc_hist)


# In[24]:


models = ['lr', 'rf', 'nb', 'dt', 'GBT', 'MLP', 'LSVM', 'ovr']
results = dict(zip(models, acc_hist))
results = sorted(results.items(), key=lambda x: x[1])
print(results)


# In[25]:


accs = []
names = []
for i, t in enumerate(results):
    accs.append(results[i][1])
    names.append(results[i][0])
print(accs, names)


# 4. Comparison and analysis

# In[26]:


# Rank models according to Test set accuracy
#=====your code here==========
fig = plt.figure()
ax = fig.add_axes([0,0,1,1])
ax.bar(range(len(results)), accs, align='center', tick_label=names, width=0.7)
#plt.xticks(range(len(results)), list(results.keys()))
plt.show()
#===============================


# *your analysis*
# <br>
# The accuracy is sorted in an ascending order.
# <br>
# mlp < naive bayes < Linear SVM < Random Forest < Decision Tree < One-vs-Rest < Linear Regression < GBT
