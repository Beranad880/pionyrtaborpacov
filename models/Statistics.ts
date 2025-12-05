import mongoose, { Document, Schema } from 'mongoose';

export interface IAgeGroup {
  range: string;
  count: number;
}

export interface IStatistics extends Document {
  year: number;
  ageGroups: IAgeGroup[];
  totalMembers: number;
  councilMembers: number;
  leadershipMembers: number;
  krpDelegates: number;
  foundedGroups: number;
  activeGroups: number;
  events: {
    meetings: number;
    camps: number;
    trips: number;
    workshops: number;
  };
  financial: {
    budget?: number;
    expenses?: number;
    income?: number;
  };
  notes?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const StatisticsSchema = new Schema<IStatistics>(
  {
    year: {
      type: Number,
      required: [true, 'Rok je povinný'],
      min: [2000, 'Rok musí být od roku 2000'],
      max: [new Date().getFullYear() + 1, 'Rok nemůže být v příliš vzdálené budoucnosti'],
    },
    ageGroups: [{
      range: {
        type: String,
        required: [true, 'Věkové rozpětí je povinné'],
        trim: true,
      },
      count: {
        type: Number,
        required: [true, 'Počet je povinný'],
        min: [0, 'Počet nemůže být záporný'],
      },
    }],
    totalMembers: {
      type: Number,
      required: [true, 'Celkový počet členů je povinný'],
      min: [0, 'Počet nemůže být záporný'],
    },
    councilMembers: {
      type: Number,
      required: [true, 'Počet členů rady je povinný'],
      min: [0, 'Počet nemůže být záporný'],
    },
    leadershipMembers: {
      type: Number,
      required: [true, 'Počet členů vedení je povinný'],
      min: [0, 'Počet nemůže být záporný'],
    },
    krpDelegates: {
      type: Number,
      required: [true, 'Počet delegátů do KRP je povinný'],
      min: [0, 'Počet nemůže být záporný'],
    },
    foundedGroups: {
      type: Number,
      required: [true, 'Počet založených oddílů je povinný'],
      min: [0, 'Počet nemůže být záporný'],
    },
    activeGroups: {
      type: Number,
      required: [true, 'Počet aktivních oddílů je povinný'],
      min: [0, 'Počet nemůže být záporný'],
    },
    events: {
      meetings: {
        type: Number,
        default: 0,
        min: [0, 'Počet nemůže být záporný'],
      },
      camps: {
        type: Number,
        default: 0,
        min: [0, 'Počet nemůže být záporný'],
      },
      trips: {
        type: Number,
        default: 0,
        min: [0, 'Počet nemůže být záporný'],
      },
      workshops: {
        type: Number,
        default: 0,
        min: [0, 'Počet nemůže být záporný'],
      },
    },
    financial: {
      budget: {
        type: Number,
        min: [0, 'Rozpočet nemůže být záporný'],
      },
      expenses: {
        type: Number,
        min: [0, 'Výdaje nemohou být záporné'],
      },
      income: {
        type: Number,
        min: [0, 'Příjmy nemohou být záporné'],
      },
    },
    notes: {
      type: String,
      maxlength: [1000, 'Poznámky nemohou být delší než 1000 znaků'],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Index for better query performance
StatisticsSchema.index({ year: -1 });
StatisticsSchema.index({ isActive: 1 });

// Ensure only one statistics record per year
StatisticsSchema.index({ year: 1 }, { unique: true });

export default mongoose.models.Statistics || mongoose.model<IStatistics>('Statistics', StatisticsSchema);